# Usa la imagen base de Node.js
FROM node:18

# Crea y define el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de configuración de tu aplicación (package.json y package-lock.json)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos del proyecto al contenedor
COPY . .

# Expone el puerto que usará la aplicación (en este caso 3000)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
