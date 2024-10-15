# Usa una imagen base de Node.js
FROM node:20.16.0 as builder

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar el archivo package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instalar dependencias
RUN npm install

COPY . .

# Listar las dependencias instaladas
RUN npm run build

EXPOSE 4173
# Comando para iniciar la aplicación
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
