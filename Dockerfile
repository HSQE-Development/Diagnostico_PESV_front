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

# Usa una imagen base de Nginx para servir la aplicación
FROM nginx:alpine

# Copia los archivos generados por Vite al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto que usará Vite
EXPOSE 80


# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
