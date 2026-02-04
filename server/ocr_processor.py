# -*- coding: utf-8 -*-
"""
Script unificado:
- Extrae A, I, D.1, D.3, P.3 usando EasyOCR + segmentación de filas.
- Extrae VIN (E) con Tesseract sobre región recortada + normalización/regex.

Uso:
  python permiso_ocr_unificado.py "ruta/al/permiso.pdf|.jpg|.png"
"""

import os, sys, re, json, math
import cv2
import numpy as np
import fitz  # PyMuPDF
import pytesseract

# Configurar encoding UTF-8 DESPUÉS de importar sys (si tu versión de Python lo permite)
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

# --- Config Tesseract (ajusta la ruta en Windows si es necesario) ---
# --- Config Tesseract ---
# Intenta obtener la ruta de las variables de entorno o usa 'tesseract' por defecto (asumiendo que está en el PATH)
tesseract_cmd = os.getenv('TESSERACT_CMD', r"C:\Program Files\Tesseract-OCR\tesseract.exe")
if os.path.exists(tesseract_cmd):
    pytesseract.pytesseract.tesseract_cmd = tesseract_cmd
else:
    # Si no existe la ruta específica, confiamos en que esté en el PATH
    pytesseract.pytesseract.tesseract_cmd = 'tesseract'
TESS_CONFIG = "--psm 6 --oem 3 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789|:/-~ "

# ==========================
# UTILIDAD: limpieza OCR (DEFINIDA ANTES DE USARLA)
# ==========================
def limpiar_texto_ocr(texto: str) -> str:
    """Limpia errores comunes de OCR y normaliza espacios."""
    if not isinstance(texto, str) or not texto:
        return texto

    t = texto

    # Caracteres raros/guiones y tuberías
    t = t.replace("—", "-").replace("–", "-").replace("_", "-")
    t = t.replace("│", "|").replace("¦", "|")

    # Confusiones típicas en combustible y otros campos
    t = t.replace("3ASOLINA", "GASOLINA")   # 3 -> G
    t = t.replace("GAS0LINA", "GASOLINA")   # 0 -> O
    t = t.replace("DiESEL", "DIESEL")
    t = t.replace("DIE5EL", "DIESEL")
    t = t.replace("HIBRIDO", "Híbrido").replace("Hibrido", "Híbrido")
    t = t.replace("ELÉCTRICO", "Eléctrico").replace("ELECTRICO", "Eléctrico")

    # Normaliza espacios
    t = " ".join(t.split())
    return t

# ==========================
# CARGA DE IMAGEN (COMÚN)
# ==========================
def load_image_any(path, dpi=300):
    ext = os.path.splitext(path)[1].lower()
    if ext in [".pdf"]:
        doc = fitz.open(path)
        page = doc.load_page(0)
        pix = page.get_pixmap(dpi=dpi)
        img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)
        if pix.n == 4:
            img = cv2.cvtColor(img, cv2.COLOR_RGBA2BGR)
        return img
    else:
        img = cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)
        if img is None:
            raise RuntimeError("No se pudo leer la imagen.")
        return img

# ==========================
# BLOQUE 1: A, I, D.1, D.3, P.3
# ==========================
def binarize(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thr = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                cv2.THRESH_BINARY_INV, 35, 15)
    return thr

def find_row_bounds(half_img):
    h, w = half_img.shape[:2]
    bw = binarize(half_img)
    k = max(10, w // 20)
    horiz_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (k, 1))
    lines = cv2.morphologyEx(bw, cv2.MORPH_OPEN, horiz_kernel, iterations=1)

    ys = np.where(lines.sum(axis=1) > w * 10)[0]
    if len(ys) == 0:
        step = max(1, h // 12)
        edges = [0] + [i for i in range(step, h, step)] + [h - 1]
        return [(edges[i], edges[i + 1]) for i in range(len(edges) - 1)]

    groups = []
    start = ys[0]
    prev = ys[0]
    for y in ys[1:]:
        if y == prev + 1:
            prev = y
        else:
            groups.append((start, prev))
            start, prev = y, y
    groups.append((start, prev))

    bounds = []
    tops = [0] + [g[1] for g in groups]
    bots = [g[0] for g in groups] + [h - 1]
    for t, b in zip(tops, bots):
        if b - t > max(14, h // 40):
            pad = 2
            y0 = max(0, t + pad)
            y1 = min(h, b - pad)
            if y1 > y0 + 5:
                bounds.append((y0, y1))
    return bounds

def ocr_easy(img):
    import easyocr
    if not hasattr(ocr_easy, "_reader"):
        ocr_easy._reader = easyocr.Reader(['es', 'en'], gpu=False)
    try:
        texts = ocr_easy._reader.readtext(img, detail=0, paragraph=True)
    except Exception:
        texts = []
    joined = " ".join(t.strip() for t in texts if t and t.strip())
    joined = joined.replace("—", "-").replace("_", "-").replace("–", "-")
    joined = " ".join(joined.split())
    return joined

def split_label_value(row_img, side="left"):
    h, w = row_img.shape[:2]
    label_w = int(w * 0.16)
    label_crop = row_img[:, :label_w]
    value_crop = row_img[:, label_w:]

    label_text_raw = ocr_easy(label_crop)
    value_text_raw = ocr_easy(value_crop)

    label = ""
    if label_text_raw:
        toks = label_text_raw.replace("|", "/").replace("I.", "I.").split()
        candidates = [t.strip().strip(":;,.") for t in toks if len(t.strip()) <= 4]
        if candidates:
            label = candidates[0].upper()

    def clean_val(s):
        s = s.replace("|", "/")
        s = s.replace("—", "-").replace("_", "-")
        s = s.replace("-------------", "").replace("----------", "").strip("- ").strip()
        if label and s.upper().startswith(label):
            s = s[len(label):].strip(" :.-")
        return s

    return label, clean_val(value_text_raw)

def extract_rows(img_bgr):
    h, w = img_bgr.shape[:2]
    margin_x = int(w * 0.02)
    margin_y = int(h * 0.02)
    img = img_bgr[margin_y:h - margin_y, margin_x:w - margin_x]

    H, W = img.shape[:2]
    mid = W // 2
    left = img[:, :mid]
    right = img[:, mid:]

    left_rows = find_row_bounds(left)
    right_rows = find_row_bounds(right)

    n = max(len(left_rows), len(right_rows))
    out = []
    for i in range(n):
        l_obj = {"label": "", "text": ""}
        r_obj = {"label": "", "text": ""}

        if i < len(left_rows):
            y0, y1 = left_rows[i]
            l_label, l_text = split_label_value(left[y0:y1, :], side="left")
            l_obj = {"label": l_label, "text": l_text}

        if i < len(right_rows):
            y0, y1 = right_rows[i]
            r_label, r_text = split_label_value(right[y0:y1, :], side="right")
            r_obj = {"label": r_label, "text": r_text}

        if (l_obj["label"] or l_obj["text"] or r_obj["label"] or r_obj["text"]):
            out.append({"left": l_obj, "right": r_obj})
    return out

def canon(label: str) -> str | None:
    if not label:
        return None
    s = label.strip().upper().replace(" ", "")
    s = s.replace("·", ".").replace(",", ".")
    s = s.replace("D1", "D.1").replace("D-1", "D.1")
    s = s.replace("D3", "D.3").replace("D-3", "D.3")
    s = s.replace("P1", "P.1").replace("P2", "P.2").replace("P3", "P.3").replace("P-3", "P.3")
    if s == "1":
        s = "I"
    return s if s in {"A", "I", "D.1", "D.3", "P.3"} else None

def pick_value(rows):
    wanted = {"A": None, "I": None, "D.1": None, "D.3": None, "P.3": None}
    for row in rows:
        for side in ("left", "right"):
            lbl = canon(row.get(side, {}).get("label", ""))
            txt = row.get(side, {}).get("text", "").strip()
            if lbl and txt and not wanted[lbl]:
                wanted[lbl] = txt
    return wanted

# ==========================
# BLOQUE 2: VIN (E)
# ==========================
def zoom(img, factor=2):
    return cv2.resize(img, None, fx=factor, fy=factor, interpolation=cv2.INTER_CUBIC)

def tesseract_text(img_or_gray):
    if len(img_or_gray.shape) == 3:
        gray = cv2.cvtColor(img_or_gray, cv2.COLOR_BGR2GRAY)
    else:
        gray = img_or_gray
    return pytesseract.image_to_string(gray, config=TESS_CONFIG).strip()

def extract_vin_region(img_bgr):
    # Recorte heurístico de la zona donde suele estar la E (VIN)
    h, w = img_bgr.shape[:2]
    x_start = int(w * 0.52)
    x_end   = int(w * 0.97)
    y_start = int(h * 0.04)
    y_end   = int(h * 0.11)
    return img_bgr[y_start:y_end, x_start:x_end]

VIN_REGEX_STRICT = re.compile(r"[A-HJ-NPR-Z0-9]{17}")  # VIN sin I,O,Q
ALNUM = re.compile(r"[^A-Z0-9]")

def limpiar_alnum_mayus(s: str) -> str:
    s = s.upper()
    return ALNUM.sub("", s)

def normalizar_confusiones(s: str) -> str:
    # Corrige confusiones típicas OCR: O->0, I->1, Q->0
    return s.replace("O", "0").replace("I", "1").replace("Q", "0")

def parte_despues_barra_o_todo(linea: str) -> str:
    raw = linea.strip().upper()
    if "|" in raw:
        return raw.split("|", 1)[1]  # lo de la DERECHA de la primera barra
    return raw

def buscar_vin_estricto_en_cadena(cadena: str):
    clean = limpiar_alnum_mayus(cadena)
    if len(clean) < 17:
        return None
    normalized = normalizar_confusiones(clean)
    m = VIN_REGEX_STRICT.search(normalized)
    if m:
        return m.group(0)
    return None

def candidato_loose_17(cadena: str) -> str:
    clean = limpiar_alnum_mayus(cadena)
    n = len(clean)
    if n < 17:
        return ""
    best = None
    best_score = -1
    for i in range(0, n - 16):
        window = clean[i:i+17]
        w_norm = normalizar_confusiones(window)
        score = sum(1 for ch in w_norm if re.match(r"[A-HJ-NPR-Z0-9]", ch))
        penalty = sum(1 for ch in window if ch in "IOQ")
        score -= penalty
        if score > best_score:
            best_score = score
            best = window
    return best or ""

def extraer_vin_y_candidato(texto: str):
    # 1) Por líneas aplicando regla de barra
    for linea in texto.splitlines():
        parte = parte_despues_barra_o_todo(linea)
        vin = buscar_vin_estricto_en_cadena(parte)
        if vin:
            cand = candidato_loose_17(parte)
            return vin, cand
    # 2) Global
    vin = buscar_vin_estricto_en_cadena(texto)
    cand = candidato_loose_17(texto)
    return vin, cand

def coincidencias_por_posicion(a: str, b: str) -> str:
    if not a or not b or len(a) != 17 or len(b) != 17:
        return ""
    return "".join(c1 for c1, c2 in zip(a, b) if c1 == c2)

# ==========================
# MAIN
# ==========================
def main():
    if len(sys.argv) < 2:
        sys.exit(1)

    path = sys.argv[1]
    img = load_image_any(path, dpi=300)

    # ---- Parte 1: A, I, D.1, D.3, P.3 ----
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    l2 = clahe.apply(l)
    img2 = cv2.cvtColor(cv2.merge([l2, a, b]), cv2.COLOR_LAB2BGR)

    rows = extract_rows(img2)
    campos_base = pick_value(rows)  # {"A":..., "I":..., "D.1":..., "D.3":..., "P.3":...}

    # ---- Parte 2: VIN (E) ----
    vin_region = extract_vin_region(img)
    try:
        cv2.imwrite("debug_vin_region.png", vin_region)
    except Exception:
        pass

    variantes = [
        ("Tesseract (original)", vin_region),
        ("Tesseract (zoom x2)", zoom(vin_region, 2)),
    ]

    textos = []
    for titulo, im in variantes:
        txt = tesseract_text(im)
        textos.append((titulo, txt))

    # Imprime salidas de Tesseract a STDERR (para depurar)
    for titulo, txt in textos:
        pass

    # Extrae VIN estricto + candidato loose
    vin_norm, cand_norm = extraer_vin_y_candidato(textos[0][1])
    vin_zoom, cand_zoom = extraer_vin_y_candidato(textos[1][1])

    vin_final = vin_norm or vin_zoom
    if not vin_final:
        combinado = "\n".join(t for _, t in textos)
        vin_final, _ = extraer_vin_y_candidato(combinado)

    comunes = coincidencias_por_posicion(cand_norm, cand_zoom)

    # ---- Salida unificada ---- (solo STDOUT)
    resultado = dict(campos_base)
    resultado["E"] = vin_final if vin_final else None

    # Limpieza final de texto en todos los campos string
    for key, value in list(resultado.items()):
        if isinstance(value, str):
            resultado[key] = limpiar_texto_ocr(value)

    print(json.dumps(resultado, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
