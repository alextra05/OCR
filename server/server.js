// server.js
/* eslint-disable no-console */
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ===== Utilidades =====
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const PYTHON_BIN = process.env.PYTHON_BIN || 'python'; // o "python3" en Linux/Mac
const OCR_SCRIPT = process.env.OCR_SCRIPT || path.join(__dirname, 'ocr_processor.py');

// ===== Función ejecutarOCR =====
async function ejecutarOCR(filePath) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn(PYTHON_BIN, [OCR_SCRIPT, filePath]);
    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      const errorText = data.toString();
      // stderr += errorText;
      // Mostrar fragmentos de error para debugging - SILENCIADO para producción
      // console.error('Error Python (fragmento):', errorText.substring(0, 200));
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Proceso Python terminó con código:', code);
        return reject(new Error(`Proceso OCR falló con código ${code}`));
      }

      try {
        // Intentar parsear como JSON
        const result = JSON.parse(stdout.trim());
        resolve(result);
      } catch (parseError) {
        console.error('Error parseando JSON:', parseError.message);

        // Fallback: intentar extraer JSON del stdout
        const jsonMatch = stdout.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const fallbackResult = JSON.parse(jsonMatch[0]);
            resolve(fallbackResult);
          } catch (fallbackError) {
            resolve({}); // Devolver objeto vacío en caso de error
          }
        } else {
          resolve({}); // Devolver objeto vacío en caso de error
        }
      }
    });

    pythonProcess.on('error', (error) => {
      console.error('Error ejecutando proceso Python:', error);
      reject(error);
    });
  });
}

// Crear carpetas necesarias
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ===== Middleware =====
app.use(cors({
  origin: 'https://ocr-1vx9.vercel.app' // Tu URL de Vercel
}));
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
  res.json({ status: 'online', message: 'Backend OCR (Sin Base de Datos) operativo', timestamp: new Date() });
});

// Multer Config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname) || '.pdf'}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no válido. Solo se permiten PDF, JPG, PNG y WEBP'), false);
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB
});

// ===== Endpoint OCR =====
app.post(
  '/api/process-pdf',
  upload.fields([
    { name: 'permiso', maxCount: 1 }
  ]),
  async (req, res) => {
    const permisoFile = req.files?.permiso?.[0] || null;

    if (!permisoFile) {
      return res.status(400).json({ error: 'Se requiere un archivo (permiso)' });
    }

    try {
      // Ejecutar OCR
      let extractedData = await ejecutarOCR(permisoFile.path);

      // Limpieza (Opcional: borrar el archivo subido después de procesar para no llenar el disco)
      // fs.unlink(permisoFile.path, () => {}); 

      return res.json({
        success: true,
        data: extractedData
      });
    } catch (err) {
      console.error('Error en /api/process-pdf:', err);

      // Limpieza en caso de error
      if (permisoFile?.path && fs.existsSync(permisoFile.path)) fs.unlink(permisoFile.path, () => { });

      return res.status(500).json({
        error: 'Error procesando el archivo',
        details: err.message
      });
    }
  }
);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor OCR corriendo en http://localhost:${PORT}`);
  console.log(`📂 Directorio de uploads: ${UPLOAD_DIR}`);
});
