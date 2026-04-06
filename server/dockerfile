FROM python:3.10-slim

# Instalamos dependencias del sistema, incluyendo Node.js
RUN apt-get update && apt-get install -y \
    curl \
    tesseract-ocr \
    libtesseract-dev \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Primero instalamos dependencias de Python para aprovechar la caché de Docker
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Luego instalamos dependencias de Node.js
COPY package.json package-lock.json ./
RUN npm install

# Copiamos todo el contenido de la carpeta server
COPY . .

# Exponemos el puerto
ENV PORT=3001
EXPOSE 3001

# Comando para arrancar el servidor Express
CMD ["npm", "start"]