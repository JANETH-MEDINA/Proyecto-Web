require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: 'localhost',
    database: process.env.DB_DATABASE || 'DanceStudio',
    password: process.env.DB_PASSWORD,
    port: 5432,
});

async function testConnection() {
    try {
        console.log('🔍 Probando conexión...');
        console.log('Usuario:', process.env.DB_USER);
        console.log('Host:', 'localhost');
        console.log('Database:', process.env.DB_DATABASE);
        console.log('Puerto:', 5432);

        const client = await pool.connect();
        console.log('✅ Conexión exitosa!');

        const result = await client.query('SELECT NOW(), version()');
        console.log('📅 Hora:', result.rows[0].now);
        console.log('📦 Versión PG:', result.rows[0].version);

        // Verificar tablas
        const tables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        console.log('\n📊 Tablas encontradas:');
        tables.rows.forEach(row => {
            console.log('  -', row.table_name);
        });

        client.release();
        await pool.end();

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\n💡 Posibles soluciones:');
        console.error('1. Verifica que PostgreSQL esté corriendo');
        console.error('2. Verifica la contraseña en .env');
        console.error('3. Ejecuta: psql -U postgres -d DanceStudio');
        process.exit(1);
    }
}

testConnection();