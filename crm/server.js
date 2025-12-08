const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const router = express.Router(); // Creamos un router para manejar las rutas

const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'panther-path-secret-key-2025'; // Usar variable de entorno en producción

// Middleware Global
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// ===========================
// ROUTER SETUP
// ===========================

// Servir archivos estáticos desde el router
router.use(express.static('public'));

// Database simulation (JSON files)
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Initialize users file with default admin
if (!fs.existsSync(USERS_FILE)) {
    const defaultUser = {
        username: 'admin',
        password: bcrypt.hashSync('admin123', 10), // Cambiar después del primer login
        email: 'admin@pantherpath.com'
    };
    fs.writeFileSync(USERS_FILE, JSON.stringify([defaultUser], null, 2));
}

// Initialize contacts file
if (!fs.existsSync(CONTACTS_FILE)) {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify([], null, 2));
}

// Helper functions
const readJSON = (file) => {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
        return [];
    }
};

const writeJSON = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

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
// ROUTES (Attached to Router)
// ===========================

// Login
router.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = readJSON(USERS_FILE);

    const user = users.find(u => u.username === username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '24h' });

    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({ success: true, token, username: user.username });
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
router.get('/api/contacts', authMiddleware, (req, res) => {
    const contacts = readJSON(CONTACTS_FILE);
    res.json(contacts);
});

// Get single contact
router.get('/api/contacts/:id', authMiddleware, (req, res) => {
    const contacts = readJSON(CONTACTS_FILE);
    const contact = contacts.find(c => c.id === req.params.id);

    if (!contact) {
        return res.status(404).json({ error: 'Contacto no encontrado' });
    }

    res.json(contact);
});

// Create contact (from waitlist form)
router.post('/api/contacts', (req, res) => {
    const contacts = readJSON(CONTACTS_FILE);

    const newContact = {
        id: Date.now().toString(),
        ...req.body,
        status: 'nuevo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: [],
        tags: []
    };

    contacts.push(newContact);
    writeJSON(CONTACTS_FILE, contacts);

    res.json({ success: true, contact: newContact });
});

// Update contact
router.put('/api/contacts/:id', authMiddleware, (req, res) => {
    const contacts = readJSON(CONTACTS_FILE);
    const index = contacts.findIndex(c => c.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: 'Contacto no encontrado' });
    }

    contacts[index] = {
        ...contacts[index],
        ...req.body,
        updatedAt: new Date().toISOString()
    };

    writeJSON(CONTACTS_FILE, contacts);
    res.json({ success: true, contact: contacts[index] });
});

// Add note to contact
router.post('/api/contacts/:id/notes', authMiddleware, (req, res) => {
    const contacts = readJSON(CONTACTS_FILE);
    const index = contacts.findIndex(c => c.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: 'Contacto no encontrado' });
    }

    const newNote = {
        id: Date.now().toString(),
        text: req.body.text,
        createdAt: new Date().toISOString(),
        createdBy: req.user.username
    };

    if (!contacts[index].notes) {
        contacts[index].notes = [];
    }

    contacts[index].notes.push(newNote);
    contacts[index].updatedAt = new Date().toISOString();

    writeJSON(CONTACTS_FILE, contacts);
    res.json({ success: true, note: newNote });
});

// Delete contact
router.delete('/api/contacts/:id', authMiddleware, (req, res) => {
    const contacts = readJSON(CONTACTS_FILE);
    const filtered = contacts.filter(c => c.id !== req.params.id);

    if (filtered.length === contacts.length) {
        return res.status(404).json({ error: 'Contacto no encontrado' });
    }

    writeJSON(CONTACTS_FILE, filtered);
    res.json({ success: true });
});

// Stats
router.get('/api/stats', authMiddleware, (req, res) => {
    const contacts = readJSON(CONTACTS_FILE);

    const stats = {
        total: contacts.length,
        nuevo: contacts.filter(c => c.status === 'nuevo').length,
        contactado: contacts.filter(c => c.status === 'contactado').length,
        enProceso: contacts.filter(c => c.status === 'en-proceso').length,
        convertido: contacts.filter(c => c.status === 'convertido').length,
        noInteresado: contacts.filter(c => c.status === 'no-interesado').length
    };

    res.json(stats);
});

// ===========================
// MOUNT ROUTER
// ===========================

// Montamos el router en la raíz Y en /crm para que funcione en ambos casos
app.use('/', router);
app.use('/crm', router);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 CRM Backend running on port ${PORT}`);
    console.log(`📊 Default login: username: admin, password: admin123`);
});
