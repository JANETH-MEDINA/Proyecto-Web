// Instalar y configurar el servidor Web
require('dotenv').config();
const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');

const app = express();
const sslOptions = {
    key: fs.readFileSync('./localhost-key.pem'), // o la ruta completa si estás en producción
    cert: fs.readFileSync('./localhost.pem')
};

const port = process.env.PORT || 3002;

// ===================================================================
// Configuración de Base de Datos PostgreSQL
// ===================================================================
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_DATABASE || 'DanceStudio',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Verificar conexión a BD
pool.on('connect', () => {
    console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ Error inesperado en PostgreSQL:', err);
    process.exit(-1);
});

// Probar conexión inicial
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Error al conectar con PostgreSQL:', err);
    } else {
        console.log('✅ Conexión exitosa a PostgreSQL');
        console.log('📅 Hora del servidor BD:', res.rows[0].now);
    }
});

// ===================================================================
// MIDDLEWARE
// ===================================================================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// ========== RUTAS PRINCIPALES ==========

// Crear página de inicio (index)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ========== RUTA DE LOGIN ==========
app.post('/api/login', async(req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    try {
        // Buscar usuario en la BD
        const result = await pool.query(
            'SELECT id, nombre_usuario, nombre_completo, rol, email FROM usuarios WHERE nombre_usuario = $1 AND password_hash = $2 AND activo = TRUE', [usuario, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const user = result.rows[0];

        // Actualizar última sesión
        await pool.query(
            'UPDATE usuarios SET ultima_sesion = CURRENT_TIMESTAMP WHERE id = $1', [user.id]
        );

        console.log(`✅ Login exitoso: ${user.nombre_usuario} (${user.rol})`);

        res.json({
            mensaje: 'Login exitoso',
            usuario: user
        });

    } catch (error) {
        console.error('❌ Error en login:', error);
        res.status(500).json({ error: 'Error al procesar el login' });
    }
});

// ========== RUTA DE LOGOUT ==========
app.post('/api/logout', (req, res) => {
    res.json({ mensaje: 'Logout exitoso' });
});

// ===================================================================
// PROBAR ACCESO A PÁGINA Y BD
// ===================================================================

// Endpoint de prueba
app.get('/api/test', async(req, res) => {
    try {
        const result = await pool.query('SELECT NOW() as fecha, version() as version');
        res.json({
            mensaje: '✅ Conexión exitosa',
            fecha: result.rows[0].fecha,
            version: result.rows[0].version
        });
    } catch (error) {
        console.error('Error en test:', error);
        res.status(500).json({ error: 'Error al conectar con la BD' });
    }
});

// ===================================================================
// RUTAS DE PRODUCTOS/SERVICIOS
// ===================================================================

// Obtener todos los productos/servicios
app.get('/api/productos', async(req, res) => {
    const { tipo } = req.query;

    try {
        let query = 'SELECT * FROM productos_servicios WHERE activo = TRUE';
        let params = [];

        if (tipo) {
            query += ' AND tipo = $1';
            params.push(tipo);
        }

        query += ' ORDER BY tipo, nombre ASC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Obtener un producto específico
app.get('/api/productos/:id', async(req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM productos_servicios WHERE id = $1', [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ error: 'Error al obtener producto' });
    }
});

// Crear producto/servicio
app.post('/api/productos', async(req, res) => {
    const { nombre, tipo, descripcion, precio, stock, imagen_url, categoria } = req.body;

    // Validación del lado del cliente (también en servidor)
    if (!nombre || !tipo || !descripcion || precio === undefined) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    if (!['producto', 'servicio'].includes(tipo)) {
        return res.status(400).json({ error: 'Tipo inválido' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO productos_servicios (nombre, tipo, descripcion, precio, stock, imagen_url, categoria) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [nombre, tipo, descripcion, precio, stock || 0, imagen_url, categoria]
        );

        console.log(`✅ Producto creado: ${nombre}`);
        res.status(201).json({
            mensaje: 'Producto creado exitosamente',
            producto: result.rows[0]
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: 'Error al crear producto' });
    }
});

// Actualizar producto (almacenar y actualizar información en BD)
app.put('/api/productos/:id', async(req, res) => {
    const { id } = req.params;
    const { nombre, tipo, descripcion, precio, stock, imagen_url, categoria } = req.body;

    try {
        const result = await pool.query(
            'UPDATE productos_servicios SET nombre = $1, tipo = $2, descripcion = $3, precio = $4, stock = $5, imagen_url = $6, categoria = $7, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *', [nombre, tipo, descripcion, precio, stock, imagen_url, categoria, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        console.log(`✏️ Producto actualizado: ${nombre}`);
        res.json({
            mensaje: 'Producto actualizado correctamente',
            producto: result.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
});

// Eliminar producto
app.delete('/api/productos/:id', async(req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM productos_servicios WHERE id = $1 RETURNING nombre', [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        console.log(`🗑️ Producto eliminado: ${result.rows[0].nombre}`);
        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

// ===================================================================
// RUTAS DE USUARIOS (CRUD + Roles + Permisos)
// ===================================================================

// Obtener todos los usuarios
app.get('/api/usuarios', async(req, res) => {
    const { rol } = req.query;

    try {
        let query = 'SELECT id, nombre_usuario, email, nombre_completo, rol, telefono, fecha_creacion, activo FROM usuarios WHERE activo = TRUE';
        let params = [];

        if (rol) {
            query += ' AND rol = $1';
            params.push(rol);
        }

        query += ' ORDER BY fecha_creacion DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Obtener un usuario específico
app.get('/api/usuarios/:id', async(req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'SELECT id, nombre_usuario, email, nombre_completo, rol, telefono, direccion, fecha_nacimiento, fecha_creacion FROM usuarios WHERE id = $1', [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
});

// Crear usuario con validación y roles
app.post('/api/usuarios', async(req, res) => {
    const { nombre_usuario, email, password, nombre_completo, rol, telefono, direccion, fecha_nacimiento } = req.body;

    // Validaciones
    if (!nombre_usuario || !email || !password || !nombre_completo || !rol) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Validar rol correcto
    if (!['admin', 'maestro', 'usuario'].includes(rol)) {
        return res.status(400).json({ error: 'Rol inválido. Debe ser: admin, maestro o usuario' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Formato de correo inválido' });
    }

    try {

        const result = await pool.query(
            'INSERT INTO usuarios (nombre_usuario, email, password_hash, nombre_completo, rol, telefono, direccion, fecha_nacimiento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, nombre_usuario, email, nombre_completo, rol', [nombre_usuario, email, password, nombre_completo, rol, telefono, direccion, fecha_nacimiento]
        );

        console.log(`✅ Usuario creado: ${nombre_usuario} (${rol})`);
        res.status(201).json({
            mensaje: 'Usuario creado exitosamente',
            usuario: result.rows[0]
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);

        if (error.code === '23505') {
            if (error.constraint === 'usuarios_nombre_usuario_key') {
                return res.status(409).json({ error: 'El nombre de usuario ya existe' });
            }
            if (error.constraint === 'usuarios_email_key') {
                return res.status(409).json({ error: 'El correo ya está registrado' });
            }
        }

        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

// Actualizar usuario
app.put('/api/usuarios/:id', async(req, res) => {
    const { id } = req.params;
    const { nombre_usuario, email, password, nombre_completo, rol, telefono, direccion, fecha_nacimiento } = req.body;

    try {
        let query, params;

        if (password && password.length >= 6) {
            query = 'UPDATE usuarios SET nombre_usuario = $1, email = $2, password_hash = $3, nombre_completo = $4, rol = $5, telefono = $6, direccion = $7, fecha_nacimiento = $8 WHERE id = $9 RETURNING id, nombre_usuario, email, nombre_completo, rol';
            params = [nombre_usuario, email, password, nombre_completo, rol, telefono, direccion, fecha_nacimiento, id];
        } else {
            query = 'UPDATE usuarios SET nombre_usuario = $1, email = $2, nombre_completo = $3, rol = $4, telefono = $5, direccion = $6, fecha_nacimiento = $7 WHERE id = $8 RETURNING id, nombre_usuario, email, nombre_completo, rol';
            params = [nombre_usuario, email, nombre_completo, rol, telefono, direccion, fecha_nacimiento, id];
        }

        const result = await pool.query(query, params);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        console.log(`✏️ Usuario actualizado: ${nombre_usuario}`);
        res.json({
            mensaje: 'Usuario actualizado correctamente',
            usuario: result.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);

        if (error.code === '23505') {
            return res.status(409).json({ error: 'El nombre de usuario o correo ya existe' });
        }

        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// Eliminar usuario
app.delete('/api/usuarios/:id', async(req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM usuarios WHERE id = $1 RETURNING nombre_usuario', [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        console.log(`🗑️ Usuario eliminado: ${result.rows[0].nombre_usuario}`);
        res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

// ===================================================================
// RUTAS ADICIONALES
// ===================================================================

// Obtener clases
app.get('/api/clases', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM clases WHERE activo = TRUE ORDER BY nombre');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener clases:', error);
        res.status(500).json({ error: 'Error al obtener clases' });
    }
});

// Obtener maestros
app.get('/api/maestros', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM maestros WHERE activo = TRUE ORDER BY nombre_completo');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener maestros:', error);
        res.status(500).json({ error: 'Error al obtener maestros' });
    }
});

// Obtener horarios
app.get('/api/horarios', async(req, res) => {
    try {
        const result = await pool.query(`
            SELECT h.*, c.nombre as clase_nombre, m.nombre_completo as maestro_nombre
            FROM horarios h
            LEFT JOIN clases c ON h.clase_id = c.id
            LEFT JOIN maestros m ON h.maestro_id = m.id
            WHERE h.activo = TRUE
            ORDER BY 
                CASE h.dia_semana
                    WHEN 'Lunes' THEN 1
                    WHEN 'Martes' THEN 2
                    WHEN 'Miércoles' THEN 3
                    WHEN 'Jueves' THEN 4
                    WHEN 'Viernes' THEN 5
                    WHEN 'Sábado' THEN 6
                    WHEN 'Domingo' THEN 7
                END,
                h.hora_inicio
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener horarios:', error);
        res.status(500).json({ error: 'Error al obtener horarios' });
    }
});

// Crear inscripción
app.post('/api/inscripciones', async(req, res) => {
    const { nombre_alumno, clase_nombre, fecha_inicio, notas } = req.body;

    if (!nombre_alumno || !clase_nombre) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO inscripciones (nombre_alumno, clase_nombre, fecha_inicio, notas) VALUES ($1, $2, $3, $4) RETURNING *', [nombre_alumno, clase_nombre, fecha_inicio || new Date(), notas]
        );

        console.log(`✅ Inscripción creada: ${nombre_alumno} -> ${clase_nombre}`);
        res.status(201).json({
            mensaje: 'Inscripción creada exitosamente',
            inscripcion: result.rows[0]
        });
    } catch (error) {
        console.error('Error al crear inscripción:', error);
        res.status(500).json({ error: 'Error al crear inscripción' });
    }
});

// Obtener inscripciones
app.get('/api/inscripciones', async(req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM inscripciones 
            WHERE activo = TRUE 
            ORDER BY fecha_inscripcion DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener inscripciones:', error);
        res.status(500).json({ error: 'Error al obtener inscripciones' });
    }
});

// ===================================================================
// MANEJO DE ERRORES
// ===================================================================

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Error handler global
app.use((err, req, res, next) => {
    console.error('❌ Error no manejado:', err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// ===================================================================
// INICIAR SERVIDOR (cambie el app.listen por el https)
// ===================================================================
const http = require('http');

http.createServer((req, res) => {
    res.writeHead(301, {
        Location: `https://${req.headers.host.replace(':3000', ':3002')}${req.url}`
    });
    res.end();
}).listen(3000, () => {
    console.log('🌐 Redirección HTTP activa en el puerto 3000');
});

https.createServer(sslOptions, app).listen(3002, () => {
    console.log('🔒 Servidor HTTPS activo en el puerto 3002');
});


// Graceful shutdown
process.on('SIGTERM', async() => {
    console.log('🛑 Cerrando servidor...');
    await pool.end();
    process.exit(0);
});

process.on('SIGINT', async() => {
    console.log('\n🛑 Cerrando servidor...');
    await pool.end();
    process.exit(0);
});