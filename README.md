# 🎵 Dance Studio - Sistema de Gestión Completo

Sistema integral de gestión para estudio de baile con Node.js, PostgreSQL, jQuery y Bootstrap.

![Dance Studio](https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=1200&h=400&fit=crop)

---

## Índice

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Funcionalidades Implementadas](#funcionalidades-implementadas)
3. [Requisitos Previos](#requisitos-previos)
4. [Instalación](#instalación)
5. [Configuración](#configuración)
6. [Uso del Sistema](#uso-del-sistema)
7. [Estructura del Proyecto](#estructura-del-proyecto)
8. [Tecnologías Utilizadas](#tecnologías-utilizadas)
9. [API Endpoints](#api-endpoints)
10. [Control de Versiones](#control-de-versiones)
11. [Validación y Calidad](#validación-y-calidad)
12. [Solución de Problemas](#solución-de-problemas)
13. [Licencia](#licencia)

---

## Descripción del Proyecto

**Dance Studio** es un sistema web completo para la gestión de un estudio de baile que incluye:

- ✅ Gestión de productos y servicios
- ✅ Administración de usuarios con roles y permisos
- ✅ Sistema de inscripciones
- ✅ Catálogo de clases y horarios
- ✅ Registro de maestros
- ✅ Interfaz moderna y responsiva

---

## Funcionalidades Implementadas

### **PASO 1-4: Fundamentos**
- ✅ **PASO 1**: Interpretación de idea del cliente
- ✅ **PASO 2**: Servidor Web configurado (Node.js + Express)
- ✅ **PASO 3**: Base de datos PostgreSQL con tablas relacionales
- ✅ **PASO 4**: Acceso a página y base de datos funcionando

### **PASO 5: Estructura y Plantillas**
- ✅ Página index correctamente estructurada
- ✅ Formularios para altas, modificaciones y eliminación
- ✅ Plantillas ABC,M (Alta, Baja, Cambio, Modificación)
- ✅ 2 tablas en la base de datos (productos_servicios, usuarios)

### **PASO 6: Estilos CSS**
- ✅ CSS para formato base del index
- ✅ CSS para encabezado y pie de página
- ✅ CSS para menús de navegación
- ✅ CSS para formularios
- ✅ Colores personalizados (grises y rosas)

### **PASO 7: Control de Versiones**
- ✅ Manejo de versiones en GitHub
- ✅ Subida de archivos CSS al repositorio
- ✅ Acceso desde el index
- ✅ .gitignore configurado

### **PASO 8: Validación HTML/CSS**
- ✅ Imágenes y links para validar código HTML (W3C Validator)
- ✅ Validación de CSS (W3C CSS Validator)
- ✅ Código fuente validado

### **PASO 9: Eventos y Elementos Dinámicos**
- ✅ jQuery como librería principal
- ✅ Eventos dinámicos en objetos del index
- ✅ Framework conocido (Bootstrap)
- ✅ Elementos aplicados a todas las páginas

### **PASO 10: Validación del Cliente**
- ✅ jQuery Validate en todos los formularios
- ✅ Validación HTML5 nativa
- ✅ Mensajes de error personalizados
- ✅ Framework de validación implementado

### **PASO 11: GitHub - Cambios Remotos**
- ✅ Manejo de versiones y actualizaciones
- ✅ Realizar cambios en repositorio del compañero
- ✅ Pull requests y merge

### **PASO 12: Validación Final**
- ✅ Validación HTML de todas las páginas
- ✅ Validación CSS completa

### **PASO 13: Productos y Servicios**
- ✅ Clase/plantilla para conexión a BD (PostgreSQL)
- ✅ Mostrar 10+ productos/servicios de la BD
- ✅ Manejo de eventos y diseño responsivo

### **PASO 14: Gestión de Usuarios**
- ✅ Módulo completo de usuarios (CRUD)
- ✅ Roles: Admin, Maestro, Usuario
- ✅ Permisos correctos en la BD
- ✅ Cifrado de contraseñas (preparado para bcrypt)

### **PASO 15: AJAX**
- ✅ AJAX para cargar productos/servicios
- ✅ AJAX para cargar usuarios
- ✅ Actualización dinámica sin recargar página
- ✅ Almacenar y actualizar información en la BD

### **PASO 16: Seguridad**
- ✅ Validación HTML en todas las páginas
- ✅ Validación CSS
- ✅ Preparado para conexión cifrada HTTPS

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v14 o superior → [Descargar](https://nodejs.org/)
- **PostgreSQL** v12 o superior → [Descargar](https://www.postgresql.org/download/)
- **npm** (viene con Node.js)
- **Git** → [Descargar](https://git-scm.com/)

---

## Instalación

### **1. Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/dance-studio.git
cd dance-studio
```

### **2. Instalar dependencias**

```bash
npm install
```

Esto instalará:
- express
- pg (PostgreSQL client)
- body-parser
- dotenv
- cors
- axios

### **3. Configurar PostgreSQL**

#### **Opción A: Usando pgAdmin**

1. Abre pgAdmin
2. Crea una base de datos llamada `DanceStudio`
3. Abre Query Tool
4. Ejecuta el contenido completo del archivo `database.sql`

#### **Opción B: Desde la terminal**

```bash
# Conectar a PostgreSQL
psql -U postgres

# Dentro de psql
CREATE DATABASE DanceStudio;
\c DanceStudio
\i /ruta/completa/al/archivo/database.sql
\q
```

### **4. Verificar que las tablas se crearon**

```sql
-- En pgAdmin o psql
\dt
SELECT * FROM productos_servicios;
SELECT * FROM usuarios;
```

Deberías ver:
- 5 tablas creadas
- 13 productos/servicios iniciales
- 4 usuarios iniciales

---

## Configuración

### **1. Crear archivo .env**

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=DanceStudio
DB_PASSWORD=TU_PASSWORD_AQUI
DB_PORT=5432

# Servidor
PORT=3001
NODE_ENV=development
```

⚠️ **IMPORTANTE**: Reemplaza `TU_PASSWORD_AQUI` con tu contraseña real de PostgreSQL.

### **2. Verificar configuración**

```bash
# Probar conexión a la base de datos
npm start
```

Deberías ver:

```
═══════════════════════════════════════════
🎵 DANCE STUDIO - Servidor Node.js
🌐 URL: http://localhost:3002/
📅 Fecha: ...
═══════════════════════════════════════════
✅ Conectado a PostgreSQL
✅ Conexión exitosa a PostgreSQL
```

---

## Uso del Sistema

### **Iniciar el servidor**

```bash
npm start
```

### **Acceder al sistema**

Abre tu navegador en: **http://localhost:3001**

### **Páginas disponibles**

| Página | URL | Descripción |
|--------|-----|-------------|
| Inicio | `/` o `/index.html` | Página principal con clases e inscripciones |
| Productos | `/productos.html` | Gestión de productos y servicios |
| Usuarios | `/usuarios.html` | Administración de usuarios |

### **Usuarios de prueba**

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | admin123 | Administrador |
| maestro_ballet | maestro123 | Maestro |
| maestro_hiphop | maestro123 | Maestro |
| alumno1 | usuario123 | Usuario |

---

## Estructura del Proyecto

```
dance-studio/
│
├── index.html              # Página principal
├── productos.html          # Gestión de productos/servicios
├── usuarios.html           # Gestión de usuarios
│
├── index.css               # Estilos principales
├── formato.css             # Estilos de formularios
│
├── index.js                # JavaScript principal con AJAX
├── productos.js            # JavaScript de productos
├── usuarios.js             # JavaScript de usuarios
│
├── server.js               # Servidor Node.js + Express
├── database.sql            # Script SQL completo
│
├── .env                    # Variables de entorno (NO SUBIR A GIT)
├── .gitignore             # Archivos a ignorar
├── package.json            # Dependencias del proyecto
└── README.md              # Esta documentación
```

---

## Tecnologías Utilizadas

### **Backend**
- **Node.js** v14+
- **Express.js** v4.18
- **PostgreSQL** v12+
- **pg** (node-postgres)
- **dotenv** para variables de entorno

### **Frontend**
- **HTML5** semántico
- **CSS3** con diseño responsivo
- **JavaScript** ES6+
- **jQuery** v3.6
- **jQuery Validate** para validación
- **Bootstrap** v5.3
- **Bootstrap Icons**
- **Animate.css** para animaciones

### **Herramientas**
- **Git/GitHub** para control de versiones
- **W3C Validator** para validación HTML
- **CSS Validator** para validación CSS
- **pgAdmin** para gestión de base de datos

---

## API Endpoints

### **Productos/Servicios**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Obtener todos los productos |
| GET | `/api/productos/:id` | Obtener un producto |
| POST | `/api/productos` | Crear producto |
| PUT | `/api/productos/:id` | Actualizar producto |
| DELETE | `/api/productos/:id` | Eliminar producto |

### **Usuarios**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/usuarios` | Obtener todos los usuarios |
| GET | `/api/usuarios/:id` | Obtener un usuario |
| POST | `/api/usuarios` | Crear usuario |
| PUT | `/api/usuarios/:id` | Actualizar usuario |
| DELETE | `/api/usuarios/:id` | Eliminar usuario |

### **Clases**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/clases` | Obtener todas las clases |
| GET | `/api/maestros` | Obtener todos los maestros |
| GET | `/api/horarios` | Obtener horarios |
| POST | `/api/inscripciones` | Crear inscripción |
| GET | `/api/inscripciones` | Obtener inscripciones |

---

## Control de Versiones (GitHub)

### **Inicializar Git**

```bash
git init
git add .
git commit -m "Initial commit: Dance Studio completo"
```

### **Conectar con GitHub**

```bash
git remote add origin https://github.com/tu-usuario/dance-studio.git
git branch -M main
git push -u origin main
```

### **Trabajar con un compañero**

```bash
# 1. Clonar repositorio del compañero
git clone https://github.com/companero/dance-studio.git

# 2. Crear una rama para tus cambios
git checkout -b feature/mi-funcionalidad

# 3. Hacer cambios y commit
git add .
git commit -m "feat: descripción de los cambios"

# 4. Subir cambios
git push origin feature/mi-funcionalidad

# 5. Crear Pull Request en GitHub
```

### **Sincronizar cambios**

```bash
# Actualizar desde el repositorio remoto
git pull origin main

# Ver historial de cambios
git log --oneline --graph
```

---

## Validación y Calidad

### **Validar HTML**

1. Ve a: https://validator.w3.org/
2. Selecciona "Validate by File Upload"
3. Sube cada archivo HTML
4. Captura pantalla de los resultados
5. Corrige errores si existen

### **Validar CSS**

1. Ve a: https://jigsaw.w3.org/css-validator/
2. Selecciona "By file upload"
3. Sube cada archivo CSS
4. Captura pantalla de los resultados
5. Corrige advertencias

### **Archivos a validar**

- ✅ `index.html`
- ✅ `productos.html`
- ✅ `usuarios.html`
- ✅ `index.css`
- ✅ `formato.css`

---

## Solución de Problemas

### **Error: "Cannot connect to database"**

**Causas:**
- PostgreSQL no está corriendo
- Contraseña incorrecta en `.env`
- Base de datos no existe

**Solución:**
```bash
# Verificar que PostgreSQL esté corriendo
# Windows: Servicios → postgresql
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql

# Verificar contraseña en .env
# Crear base de datos si no existe
psql -U postgres
CREATE DATABASE DanceStudio;
\q
```

### **Error: "Port 3001 already in use"**

**Solución:**
```bash
# Opción 1: Cambiar puerto en .env
PORT=3002

# Opción 2: Matar proceso (Windows)
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Opción 3: Matar proceso (Mac/Linux)
lsof -ti:3001 | xargs kill -9
```

### **Error: "Module not found"**

**Solución:**
```bash
npm install
```

### **Las imágenes no se cargan**

**Solución:**
- Verifica tu conexión a internet (imágenes de Unsplash)
- Verifica que los archivos CSS estén vinculados correctamente

---

## Diseño Responsivo

El sistema es 100% responsivo y funciona en:

- ✅ **Desktop** (1200px+)
- ✅ **Tablet** (768px - 1199px)
- ✅ **Mobile** (< 768px)

---

## Para Producción

### **1. Instalar bcrypt para contraseñas**

```bash
npm install bcrypt
```

```javascript
// En server.js
const bcrypt = require('bcrypt');
const password_hash = await bcrypt.hash(password, 10);
```

### **2. Configurar HTTPS**

```bash
# Usar Certbot (Let's Encrypt)
sudo certbot --nginx -d tudominio.com
```

### **3. Variables de entorno**

```env
NODE_ENV=production
DB_HOST=tu-servidor-db.com
```

### **4. Usar PM2**

```bash
npm install -g pm2
pm2 start server.js --name dance-studio
pm2 save
pm2 startup
```

---

## Licencia

Este proyecto es para fines educativos - Proyecto de Programación Web.


## Soporte

Si tienes problemas:

1. Revisa la sección de [Solución de Problemas](#solución-de-problemas)
2. Verifica la consola del navegador (F12)
3. Revisa los logs del servidor
4. Consulta la documentación oficial de cada tecnología

---

**¡Listo para usar! 💃🕺**
