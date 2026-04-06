FROM python:3.10-slim

# Instalamos dependencias del sistema, incluyendo Node.js
# Cambiamos libgl1-mesa-glx por libgl1 para compatibilidad
RUN apt-get update && apt-get install -y \
    curl \
    tesseract-ocr \
    libtesseract-dev \
    libgl1 \
    libglib2.0-0 \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Primero instalamos dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Luego instalamos dependencias de Node.js
COPY package*.json ./
RUN npm install

# Copiamos todo el contenido de la carpeta server
COPY . .

# Exponemos el puerto
ENV PORT=3001
EXPOSE 3001

# Comando para arrancar el servidor Express
CMD ["npm", "start"]