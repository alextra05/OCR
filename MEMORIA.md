# MEMORIA TÉCNICA
## SISTEMA DE RECONOCIMIENTO ÓPTICO DE CARACTERES (OCR) PARA DOCUMENTACIÓN VEHICULAR

---

### 1. INTRODUCCIÓN Y MOTIVACIÓN

El presente proyecto nace como una iniciativa personal desarrollada durante el periodo estival, impulsada por un profundo interés en las tecnologías de Visión Artificial y su aplicación práctica en problemas cotidianos.

El objetivo principal fue desarrollar una herramienta accesible y eficiente capaz de digitalizar y extraer información estructurada de Permisos de Circulación de vehículos. Lo que comenzó como un reto de aprendizaje personal ("Summer Project"), evolucionó hacia una solución robusta que busca facilitar la automatización de procesos administrativos, eliminando la tediosa tarea de la transcripción manual de datos.

Si bien la interfaz visual es accesible vía web para demostrar sus capacidades de diseño y usabilidad, la funcionalidad "core" de OCR requiere de un entorno de ejecución local debido a la complejidad de las dependencias de procesamiento de imagen, lo cual invita a la comunidad de desarrolladores a clonar, explorar y contribuir al repositorio.

---

### 2. ARQUITECTURA TÉCNICA Y TECNOLOGÍAS

El sistema implementa una arquitectura desacoplada (Frontend-Backend) moderna, diseñada para la eficiencia y la escalabilidad.

#### A. Frontend: React + Vite
Se optó por **React** debido a su capacidad para gestionar el estado de la aplicación en tiempo real, algo crucial cuando se muestra el feedback de la subida de archivos y los resultados del escaneo.
*   **Vite:** Utilizado como empaquetador para garantizar tiempos de carga instantáneos y una experiencia de desarrollo fluida.
*   **TailwindCSS:** Para un diseño de interfaz ("UI") moderno, responsivo y visualmente impactante, con énfasis en la estética "Dark Mode" profesional.

#### B. Backend Híbrido: Node.js + Python
A diferencia de una arquitectura monolítica tradicional, este proyecto utiliza un patrón de **"Process Spawning"**:
1.  **Node.js (Express):** Actúa como la API Gateway y gestor de archivos. Es extremadamente rápido manejando peticiones HTTP y subidas de archivos (usando `Multer`).
2.  **Scripts de Python:** La lógica de inteligencia artificial no reside en el servidor web, sino en scripts aislados (`ocr_processor.py`). Node.js invoca a Python solo cuando es necesario procesar una imagen, permitiendo un uso eficiente de los recursos.

#### C. Motor OCR: Tesseract + EasyOCR + OpenCV
El núcleo del procesamiento de imágenes utiliza una estrategia de múltiples etapas para maximizar la precisión:
*   **OpenCV (`cv2`):** Para el preprocesamiento de imagen (binarización, corrección de ruido y detección de bordes) antes de intentar leer texto.
*   **Tesseract OCR:** Utilizado específicamente para la extracción de códigos alfanuméricos estrictos como el número de bastidor (VIN), donde la precisión carácter a carácter es crítica.
*   **EasyOCR:** Implementado para lecturas de campos de texto más complejos donde Tesseract puede fallar (Nombres, fechas, direcciones), aprovechando modelos de aprendizaje profundo.

---

### 3. ANÁLISIS DE LA ESTRUCTURA DE ARCHIVOS

El proyecto se estructura en dos directorios principales que separan claramente las responsabilidades:

#### 📂 `/ocr-visual` (La Interfaz)
Contiene todo el código fuente del cliente (Frontend).
*   **`src/components`**: Componentes reutilizables como el escáner visual o los modales de ayuda.
*   **`src/TestOcrPage.jsx`**: El "cerebro" del frontend. Gestiona la selección del archivo, envía la petición al servidor y renderiza los datos extraídos con animaciones.
*   **`tailwind.config.js`**: Configuración del sistema de diseño.

#### 📂 `/server` (El Motor)
Contiene la lógica del servidor y procesamiento.
*   **`server.js`**: El punto de entrada de la API. Define el endpoint `/api/process-pdf`, guarda el archivo temporalmente y lanza el subproceso de Python usando `child_process`.
*   **`ocr_processor.py`**: El script crítico. Contiene algoritmos avanzados de segmentación de líneas, limpieza de texto (regex) y lógica de "fallback" (si un método de lectura falla, intenta otro).
*   **`uploads/`**: Directorio temporal donde se almacenan las imágenes mientras son procesadas.

---

### 4. GUÍA DE DESPLIEGUE LOCAL

Para utilizar la funcionalidad de OCR, es necesario ejecutar el "cerebro" del sistema en tu propia máquina. Sigue estos pasos para un despliegue exitoso.

#### Requisitos Previos
Asegúrate de tener instalado:
1.  **Node.js** (v18 o superior).
2.  **Python** (v3.8 o superior).
3.  **Tesseract OCR**: Debe estar instalado en tu sistema operativo (es el motor que lee el texto).
    *   *Windows:* Instalar el ejecutable y verificar que la ruta sea `C:\Program Files\Tesseract-OCR\tesseract.exe` (o añadirlo al PATH).
    *   *Linux:* `sudo apt install tesseract-ocr`

#### Paso 1: Clonar el Repositorio
Abre tu terminal y ejecuta:
```bash
git clone <URL_DEL_REPOSITORIO>
cd pagina
```

#### Paso 2: Instalar Dependencias
Este proyecto requiere librerías tanto de JavaScript como de Python.

**A. Instalar dependencias del Sistema (Frontend y Backend):**
El proyecto cuenta con un script unificado en el `package.json` raíz.
```bash
npm install
npm run install:all
```
*(Si este comando falla, puedes instalar manualmente entrando a cada carpeta: `cd ocr-visual && npm install` y `cd server && npm install`).*

**B. Instalar dependencias de Python:**
Necesarias para el procesamiento de imágenes.
```bash
cd server
pip install -r requirements.txt
```
*(Las dependencias principales son: `opencv-python`, `pytesseract`, `easyocr`, `pymupdf`).*

#### Paso 3: Ejecución
Regresa a la carpeta raíz y lanza el sistema completo con un solo comando:
```bash
npm run dev
```
Este comando iniciará concurrentemente:
*   El servidor Backend en el puerto **3001**.
*   La aplicación Frontend en el puerto **5173**.

Abre tu navegador en `http://localhost:5173/test-ocr` y sube tu primer documento digital o escaneado.

---

### 5. LIMITACIONES TÉCNICAS ACTUALES Y FUTURO

Es importante destacar una limitación clave de la versión "demo" online frente a la versión local:

1.  **Dependencia de Binarios del Sistema:** El motor OCR depende de `Tesseract` y de librerías de C++ compiladas para Python (como Torch, usado por EasyOCR). Estos componentes no pueden ejecutarse en un hosting estático tradicional (como Vercel o Netlify) donde actualmente se aloja el frontend.
2.  **Entorno de Servidor Requerido:** Para que la versión online sea 100% funcional, el backend (`/server`) debería desplegarse en un VPS (como AWS EC2, DigitalOcean o Render) con capacidad de computación suficiente para procesar imágenes en tiempo real.

Por este motivo, la **versión local** es la única forma actual de experimentar la potencia completa del algoritmo de extracción de datos, garantizando privacidad y velocidad de procesamiento.
