FROM node:20.16.0 AS build

# 2. Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# 3. Copiar el archivo package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# 4. Instalar dependencias
RUN npm install

# 5. Copiar el resto de la aplicación al contenedor
COPY . .

# 6. Construir la aplicación para producción
RUN npm run build

# 7. Servir la aplicación usando una imagen base de Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# 8. Exponer el puerto en el que Nginx servirá la aplicación
EXPOSE 5173

# 9. Iniciar Nginx
CMD ["npm","run", "dev", "--", "--host", "0.0.0.0"]