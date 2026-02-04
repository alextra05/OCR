# Sistema de Gestión de Vehículos con OCR Visual

Este proyecto es una aplicación web moderna para la gestión de documentos de vehículos. Combina una interfaz visual interactiva con un potente backend de procesamiento OCR (Reconocimiento Óptico de Caracteres) para extraer datos automáticamente de permisos de circulación escaneados.

## 🚀 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

1.  **Node.js**: Se recomienda la versión v20.12+ o v22.12+ (requisito de Vite).
2.  **Python** (v3.8 o superior).
3.  **Tesseract OCR**:
    *   **Windows**: Instalar desde [UB-Mannheim/tesseract](https://github.com/UB-Mannheim/tesseract/wiki).
        *   Ruta esperada: `C:\Program Files\Tesseract-OCR\tesseract.exe`
    *   **Linux/Mac**: `sudo apt install tesseract-ocr`
4.  **MySQL**: Base de datos corriendo en puerto 3306 (Opcional si solo pruebas el modo OCR).

## 🛠️ Instalación y Configuración

Sigue estos pasos para clonar y preparar el entorno de desarrollo:

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

### 2. Instalar dependencias (Todo en uno)
Hemos preparado un script que instala las dependencias del frontend, backend y librerías de Python automáticamente desde la raíz:

```bash
npm run install:all
```

*Esto instalará `node_modules` en `/ocr-visual`, en `/server` y las librerías Python necesarias.*

## ▶️ Ejecución en Desarrollo

Para iniciar la aplicación completa (Frontend + Backend) con un solo comando desde la raíz:

```bash
npm run dev
```

Esto iniciará:
- **Frontend (Vite/React)**: http://localhost:5173
- **Backend (Express)**: http://localhost:3001

### 🚗 Probar Modelo OCR
1. Abre la aplicación en tu navegador.
2. Haz clic en el botón **"PROBAR"** o navega a `/test-ocr`.
3. Sube una imagen o PDF de un Permiso de Circulación.
4. El sistema procesará el documento y mostrará los datos extraídos en tiempo real.

## 📂 Estructura del Proyecto

- **/ocr-visual**: Frontend moderno construido con React, Vite y TailwindCSS.
- **/server**: API REST en Node.js + Express. Incluye el script `ocr_processor.py`.
- **/database**: Scripts SQL.

## ⚠️ Solución de Error de Versión Node.js
Si al ejecutar recibes un error como "Vite requires Node.js version ...", por favor actualiza tu Node.js a la última versión estable (LTS) desde [nodejs.org](https://nodejs.org/).
