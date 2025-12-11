const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const mercadopago = require('mercadopago');
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

// Configure MercadoPago
if (process.env.MERCADOPAGO_ACCESS_TOKEN) {
    mercadopago.configure({
        access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
    });
}

// Email Transporter
const emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Middleware Global
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Webhook endpoint for Stripe (raw body needed)
app.post('/api/webhooks/stripe', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
        const session = event.data.object;
        await handlePaymentSuccess({
            email: session.customer_email || session.receipt_email,
            amount: session.amount_total || session.amount,
            currency: session.currency,
            payment_method: 'stripe',
            transaction_id: session.id,
            metadata: session.metadata
        });
    }

    res.json({received: true});
});

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

        // Create contacts table with payment fields
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
                payment_status VARCHAR(50) DEFAULT 'pending',
                payment_method VARCHAR(50),
                payment_amount DECIMAL(10,2),
                payment_currency VARCHAR(10),
                transaction_id VARCHAR(255),
                payment_date TIMESTAMP NULL,
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
                ['admin', hashedPassword, 'nicole@pantherpath.co']
            );
            console.log('✅ Default admin user created');
        }

        connection.release();
        console.log('✅ Database initialized successfully');
    } catch (error) {
        console.error('❌ Database initialization error:', error);
    }
}

// Send Welcome Email with Payment Links
async function sendWelcomeEmail(contactData) {
    try {
        // Read email template
        const templatePath = path.join(__dirname, 'email-templates', 'welcome.html');
        let htmlContent = await fs.readFile(templatePath, 'utf-8');

        // Replace placeholders
        htmlContent = htmlContent
            .replace(/{{NOMBRE}}/g, contactData.nombre || 'Amigo/a')
            .replace(/{{STRIPE_LINK_50}}/g, process.env.STRIPE_LINK_50 || '#')
            .replace(/{{STRIPE_LINK_80}}/g, process.env.STRIPE_LINK_80 || '#')
            .replace(/{{STRIPE_LINK_110}}/g, process.env.STRIPE_LINK_110 || '#')
            .replace(/{{MERCADOPAGO_LINK_50}}/g, process.env.MERCADOPAGO_LINK_50 || '#')
            .replace(/{{MERCADOPAGO_LINK_80}}/g, process.env.MERCADOPAGO_LINK_80 || '#')
            .replace(/{{MERCADOPAGO_LINK_110}}/g, process.env.MERCADOPAGO_LINK_110 || '#')
            .replace(/{{PAYPAL_LINK_50}}/g, process.env.PAYPAL_LINK_50 || '#')
            .replace(/{{PAYPAL_LINK_80}}/g, process.env.PAYPAL_LINK_80 || '#')
            .replace(/{{PAYPAL_LINK_110}}/g, process.env.PAYPAL_LINK_110 || '#');

        const mailOptions = {
            from: process.env.EMAIL_FROM || 'Panther Path <nicole@pantherpath.co>',
            to: contactData.email,
            subject: '🎉 ¡Bienvenido/a a Panther Path! - Asegura tu lugar',
            html: htmlContent
        };

        await emailTransporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${contactData.email}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
        return false;
    }
}

// Send Payment Notification to Admin
async function sendPaymentNotification(paymentData) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || 'Panther Path <nicole@pantherpath.co>',
            to: 'nicole@pantherpath.co',
            subject: `💰 Nuevo Pago Recibido - $${paymentData.amount} ${paymentData.currency.toUpperCase()}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                    <div style="background-color: #000; color: #D4AF37; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0;">PANTHER | PATH</h1>
                        <p style="margin: 5px 0 0;">Notificación de Pago</p>
                    </div>
                    <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
                        <h2 style="color: #D4AF37; margin-top: 0;">¡Nuevo pago recibido!</h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email del cliente:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;">${paymentData.email}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Monto:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;">$${(paymentData.amount / 100).toFixed(2)} ${paymentData.currency.toUpperCase()}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Método de pago:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;">${paymentData.payment_method.toUpperCase()}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>ID de transacción:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;">${paymentData.transaction_id}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px;"><strong>Fecha:</strong></td>
                                <td style="padding: 10px;">${new Date().toLocaleString('es-ES')}</td>
                            </tr>
                        </table>
                        <p style="margin-top: 20px; padding: 15px; background-color: #f0f0f0; border-left: 4px solid #D4AF37;">
                            El CRM ha sido actualizado automáticamente con esta información.
                        </p>
                    </div>
                </div>
            `
        };

        await emailTransporter.sendMail(mailOptions);
        console.log('✅ Payment notification sent to admin');
        return true;
    } catch (error) {
        console.error('❌ Error sending payment notification:', error);
        return false;
    }
}

// Handle Payment Success (called by webhooks)
async function handlePaymentSuccess(paymentData) {
    try {
        // Find contact by email
        const [contacts] = await pool.execute('SELECT * FROM contacts WHERE email = ?', [paymentData.email]);

        if (contacts.length > 0) {
            const contact = contacts[0];
            
            // Update contact with payment info
            await pool.execute(
                `UPDATE contacts SET 
                    payment_status = 'paid',
                    payment_method = ?,
                    payment_amount = ?,
                    payment_currency = ?,
                    transaction_id = ?,
                    payment_date = NOW(),
                    status = 'convertido'
                WHERE id = ?`,
                [
                    paymentData.payment_method,
                    paymentData.amount / 100, // Convert cents to dollars
                    paymentData.currency,
                    paymentData.transaction_id,
                    contact.id
                ]
            );

            // Send notification to admin
            await sendPaymentNotification(paymentData);

            console.log(`✅ Payment processed for contact ${contact.email}`);
        } else {
            console.log(`⚠️ No contact found for email ${paymentData.email}`);
        }
    } catch (error) {
        console.error('❌ Error handling payment success:', error);
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

        // Send welcome email with payment links
        await sendWelcomeEmail(newContact[0]);

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
        const [paid] = await pool.execute('SELECT COUNT(*) as count FROM contacts WHERE payment_status = "paid"');
        const [totalRevenue] = await pool.execute('SELECT SUM(payment_amount) as total FROM contacts WHERE payment_status = "paid"');

        res.json({
            total: total[0].count,
            nuevo: nuevo[0].count,
            contactado: contactado[0].count,
            enProceso: enProceso[0].count,
            convertido: convertido[0].count,
            noInteresado: noInteresado[0].count,
            paid: paid[0].count,
            totalRevenue: totalRevenue[0].total || 0
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Webhook for MercadoPago
router.post('/api/webhooks/mercadopago', async (req, res) => {
    try {
        const { type, data } = req.body;

        if (type === 'payment') {
            const paymentId = data.id;
            const payment = await mercadopago.payment.get(paymentId);

            if (payment.body.status === 'approved') {
                await handlePaymentSuccess({
                    email: payment.body.payer.email,
                    amount: payment.body.transaction_amount * 100, // Convert to cents
                    currency: payment.body.currency_id.toLowerCase(),
                    payment_method: 'mercadopago',
                    transaction_id: payment.body.id.toString(),
                    metadata: payment.body.metadata
                });
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('MercadoPago webhook error:', error);
        res.status(500).send('Error');
    }
});

// Webhook for PayPal (simplified - you'll need to implement IPN verification)
router.post('/api/webhooks/paypal', async (req, res) => {
    try {
        const { event_type, resource } = req.body;

        if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
            await handlePaymentSuccess({
                email: resource.payer.email_address,
                amount: parseFloat(resource.amount.value) * 100, // Convert to cents
                currency: resource.amount.currency_code.toLowerCase(),
                payment_method: 'paypal',
                transaction_id: resource.id,
                metadata: resource.custom_id ? JSON.parse(resource.custom_id) : {}
            });
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('PayPal webhook error:', error);
        res.status(500).send('Error');
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

// Test email endpoint (for debugging)
router.post('/api/test-email', authMiddleware, async (req, res) => {
    try {
        const { email, nombre } = req.body;
        const result = await sendWelcomeEmail({ email, nombre });
        res.json({ success: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        console.log(`📧 Email configured: ${process.env.EMAIL_USER || 'Not configured'}`);
        console.log(`💳 Payment gateways: Stripe, MercadoPago, PayPal`);
    });
});
