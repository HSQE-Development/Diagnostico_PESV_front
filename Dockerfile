# Usa una imagen base de Node.js
FROM node:20.16.0

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar el archivo package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Listar las dependencias instaladas
RUN ls -la node_modules/

# Copiar el resto de la aplicación al contenedor
COPY . .

# Exponer el puerto que usará Vite
EXPOSE 5173

# Iniciar el servidor de desarrollo de Vite
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
