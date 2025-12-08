const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const router = express.Router();

const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'panther-path-secret-key-2025';

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'vukcpszx_pantherpath_crm',
    password: process.env.DB_PASSWORD || 'Nicole.2025$$',
    database: process.env.DB_NAME || 'vukcpszx_pantherpath_crm',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware Global
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Servir archivos estáticos
router.use(express.static('public'));

// Initialize database tables
async function initDatabase() {
    try {
        const connection = await pool.getConnection();

        // Create users table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create contacts table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS contacts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100),
                email VARCHAR(100),
                pais VARCHAR(100),
                telefono VARCHAR(50),
                experiencia VARCHAR(50),
                disciplina VARCHAR(50),
                retos TEXT,
                objetivo TEXT,
                motivacion TEXT,
                coaching_previo VARCHAR(50),
                proceso_ideal TEXT,
                comentarios TEXT,
                aceptar_comunicaciones BOOLEAN DEFAULT false,
                status VARCHAR(50) DEFAULT 'nuevo',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Create notes table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS notes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                contact_id INT NOT NULL,
                text TEXT NOT NULL,
                created_by VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
            )
        `);

        // Check if admin user exists
        const [users] = await connection.execute('SELECT * FROM users WHERE username = ?', ['admin']);

        if (users.length === 0) {
            const hashedPassword = bcrypt.hashSync('admin123', 10);
            await connection.execute(
                'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
                ['admin', hashedPassword, 'admin@pantherpath.com']
            );
            console.log('✅ Default admin user created');
        }

        connection.release();
        console.log('✅ Database initialized successfully');
    } catch (error) {
        console.error('❌ Database initialization error:', error);
    }
}

// Auth middleware
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};

// ===========================
// ROUTES
// ===========================

// Login
router.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [users] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (users.length === 0 || !bcrypt.compareSync(password, users[0].password)) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = users[0];
        const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '24h' });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ success: true, token, username: user.username });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Logout
router.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
});

// Check auth
router.get('/api/check-auth', authMiddleware, (req, res) => {
    res.json({ authenticated: true, username: req.user.username });
});

// Get all contacts
router.get('/api/contacts', authMiddleware, async (req, res) => {
    try {
        const [contacts] = await pool.execute('SELECT * FROM contacts ORDER BY created_at DESC');

        // Get notes for each contact
        for (let contact of contacts) {
            const [notes] = await pool.execute('SELECT * FROM notes WHERE contact_id = ? ORDER BY created_at DESC', [contact.id]);
            contact.notes = notes;
        }

        res.json(contacts);
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Get single contact
router.get('/api/contacts/:id', authMiddleware, async (req, res) => {
    try {
        const [contacts] = await pool.execute('SELECT * FROM contacts WHERE id = ?', [req.params.id]);

        if (contacts.length === 0) {
            return res.status(404).json({ error: 'Contacto no encontrado' });
        }

        const contact = contacts[0];
        const [notes] = await pool.execute('SELECT * FROM notes WHERE contact_id = ? ORDER BY created_at DESC', [contact.id]);
        contact.notes = notes;

        res.json(contact);
    } catch (error) {
        console.error('Get contact error:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Create contact (from waitlist form) - No auth required
router.post('/api/contacts', async (req, res) => {
    try {
        const {
            nombre, email, pais, telefono, experiencia, disciplina,
            retos, objetivo, motivacion, coaching_previo, proceso_ideal,
            comentarios, aceptar_comunicaciones
        } = req.body;

        // Convert retos array to string if needed
        const retosStr = Array.isArray(retos) ? retos.join(', ') : retos;

        const [result] = await pool.execute(
            `INSERT INTO contacts (nombre, email, pais, telefono, experiencia, disciplina, retos, objetivo, motivacion, coaching_previo, proceso_ideal, comentarios, aceptar_comunicaciones) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, email, pais, telefono, experiencia, disciplina, retosStr, objetivo, motivacion, coaching_previo, proceso_ideal, comentarios, aceptar_comunicaciones ? 1 : 0]
        );

        const [newContact] = await pool.execute('SELECT * FROM contacts WHERE id = ?', [result.insertId]);

        res.json({ success: true, contact: newContact[0] });
    } catch (error) {
        console.error('Create contact error:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Update contact
router.put('/api/contacts/:id', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;

        await pool.execute('UPDATE contacts SET status = ? WHERE id = ?', [status, req.params.id]);

        const [contacts] = await pool.execute('SELECT * FROM contacts WHERE id = ?', [req.params.id]);

        if (contacts.length === 0) {
            return res.status(404).json({ error: 'Contacto no encontrado' });
        }

        res.json({ success: true, contact: contacts[0] });
    } catch (error) {
        console.error('Update contact error:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Add note to contact
router.post('/api/contacts/:id/notes', authMiddleware, async (req, res) => {
    try {
        const { text } = req.body;

        const [result] = await pool.execute(
            'INSERT INTO notes (contact_id, text, created_by) VALUES (?, ?, ?)',
            [req.params.id, text, req.user.username]
        );

        const [notes] = await pool.execute('SELECT * FROM notes WHERE id = ?', [result.insertId]);

        res.json({ success: true, note: notes[0] });
    } catch (error) {
        console.error('Add note error:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Delete contact
router.delete('/api/contacts/:id', authMiddleware, async (req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM contacts WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Contacto no encontrado' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Stats
router.get('/api/stats', authMiddleware, async (req, res) => {
    try {
        const [total] = await pool.execute('SELECT COUNT(*) as count FROM contacts');
        const [nuevo] = await pool.execute('SELECT COUNT(*) as count FROM contacts WHERE status = "nuevo"');
        const [contactado] = await pool.execute('SELECT COUNT(*) as count FROM contacts WHERE status = "contactado"');
        const [enProceso] = await pool.execute('SELECT COUNT(*) as count FROM contacts WHERE status = "en-proceso"');
        const [convertido] = await pool.execute('SELECT COUNT(*) as count FROM contacts WHERE status = "convertido"');
        const [noInteresado] = await pool.execute('SELECT COUNT(*) as count FROM contacts WHERE status = "no-interesado"');

        res.json({
            total: total[0].count,
            nuevo: nuevo[0].count,
            contactado: contactado[0].count,
            enProceso: enProceso[0].count,
            convertido: convertido[0].count,
            noInteresado: noInteresado[0].count
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Health check
router.get('/api/health', async (req, res) => {
    try {
        await pool.execute('SELECT 1');
        res.json({ status: 'ok', database: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'error', database: 'disconnected' });
    }
});

// Mount router
app.use('/', router);
app.use('/crm', router);

// Initialize database and start server
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 CRM Backend running on port ${PORT}`);
        console.log(`📊 Default login: username: admin, password: admin123`);
        console.log(`🔗 CRM URL: https://pantherpath.co/crm`);
    });
});
