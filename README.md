# 🐾 Backend - API de Adopción de Mascotas

## 📄 Descripción

Este proyecto es una API RESTful desarrollada con Node.js, Express y MongoDB. Permite gestionar usuarios, refugios, personas y mascotas disponibles para adopción. Incluye autenticación con JWT, gestión de imágenes y validación de datos.

## 🛠️ Tecnologías utilizadas

- Node.js
- Express
- MongoDB (con Mongoose)
- Multer (para manejo de imágenes)
- JSON Web Token (JWT) para autenticación
- Dotenv (para variables de entorno)
- bcrypt (encriptación de contraseñas)

## 🚀 Instalación y ejecución

### 🔧 Instalación

#### 1. Clonar el repositorio:

```bash
git clone https://github.com/nancy172/back-parcial2.git
cd back-parcial2
```

#### 2. Instalar dependencias:

```bash
npm install
```

#### 3. Crear el archivo .env:

```
PORT = 3000
MONGODB_URI = mongodb://<user>:<password>@cluster0.tzrr2gn.mongodb.net/<db_name>?retryWrites=true&w=majority&appName=Cluster0
SECRET_KEY = clave
```

#### 4. Crear carpeta para las imágenes (si no existe):

```bash
mkdir uploads
```

### ▶️ Ejecución

#### Ejecutar servidor:

```bash
npm start
```

## 🔗 Endpoints principales

| Endpoint       | Descripción                          |
| --------------- | ------------------------------------ |
| `/api/users`    | Gestión de usuarios                 |
| `/api/persons`  | Gestión de datos de personas        |
| `/api/refuges`  | Gestión de datos de refugios        |
| `/api/pets`     | Gestión de mascotas                 |

## 📄 Licencia

Este proyecto es de uso académico.
- **Nombre y Apellido:** Nancy Correa
- **Materia:** Aplicaciones Híbridas
- **Docente:** Jonathan Emanuel Cruz
- **Comisión:** DWM4AP
