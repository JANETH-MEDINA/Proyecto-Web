const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3001;

// Configura tu conexión a PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'DanceAcademy',
    password: 'M08M06M04J',
    port: 5432,
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Ruta para guardar inscripciones
app.post('/guardar', async(req, res) => {
    const { nombre, clase } = req.body;

    try {
        await pool.query(
            'INSERT INTO inscripciones (nombre, clase) VALUES ($1, $2)', [nombre, clase]
        );
        res.json({ mensaje: 'Inscripción guardada correctamente' });
    } catch (error) {
        console.error('Error al guardar en la base de datos:', error);
        res.status(500).json({ mensaje: 'Error al guardar' });
    }
});

// Ruta para registrar maestros
app.post('/registrar-maestro', async(req, res) => {
    const { nombre, especialidad, correo, telefono } = req.body;

    try {
        await pool.query(
            'INSERT INTO maestros (nombre, especialidad, correo, telefono) VALUES ($1, $2, $3, $4)', [nombre, especialidad, correo, telefono]
        );
        res.json({ mensaje: 'Maestro registrado correctamente' });
    } catch (error) {
        console.error('Error al registrar maestro:', error);
        res.status(500).json({ mensaje: 'Error al registrar maestro' });
    }
});

// Ruta para obtener la lista de clases
app.get('/clases', async(req, res) => {
    try {
        const result = await pool.query('SELECT nombre FROM clases ORDER BY nombre ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener las clases:', error);
        res.status(500).json({ mensaje: 'Error al obtener las clases' });
    }
});

// Inicia el servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
}); //prueba