const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = require('./middleware/auth');
const roleCheck = require('./middleware/roleCheck');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
    } else {
        console.log('✅ Connected to SQLite database');
    }
});

// Create contacts table
db.run(`
  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    company TEXT,
    position TEXT,
    tags TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create activity_logs table
db.run(`
  CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    action TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Helper function to log activity
const logActivity = (userId, action, details) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    db.run(
        'INSERT INTO activity_logs (id, user_id, action, details) VALUES (?, ?, ?, ?)',
        [id, userId, action, JSON.stringify(details || {})],
        (err) => {
            if (err) console.error('❌ Failed to log activity:', err);
        }
    );
};

// Create users table and default admin
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'viewer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, () => {
    db.get('SELECT * FROM users WHERE email = ?', ['admin@example.com'], async (err, row) => {
        if (!row) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
            db.run(
                'INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
                [id, 'admin', 'admin@example.com', hashedPassword, 'admin'],
                (err) => {
                    if (!err) {
                        console.log('👤 Default admin user created: admin@example.com / admin123');
                    }
                }
            );
        }
    });
});

// ========== AUTH ROUTES ==========

// Register new user
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }

        // Check if user already exists
        db.get('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], async (err, row) => {
            if (row) {
                return res.status(409).json({ error: 'User already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
            const userRole = role || 'viewer';

            // Insert user
            db.run(
                'INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
                [id, username, email, hashedPassword, userRole],
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to create user' });
                    }

                    // Generate JWT token
                    const token = jwt.sign(
                        { userId: id, email, role: userRole },
                        process.env.JWT_SECRET,
                        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
                    );

                    res.status(201).json({
                        message: 'User created successfully',
                        token,
                        user: {
                            id,
                            username,
                            email,
                            role: userRole
                        }
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Check password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user
app.get('/api/auth/me', authMiddleware, (req, res) => {
    db.get('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [req.user.userId], (err, user) => {
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    });
});
// ========== ACTIVITY LOG ROUTES ==========

// GET all activities (Admin only)
app.get('/api/activities', authMiddleware, roleCheck(['admin']), (req, res) => {
    db.all(`
        SELECT al.*, u.username as actor 
        FROM activity_logs al 
        LEFT JOIN users u ON al.user_id = u.id 
        ORDER BY al.created_at DESC 
        LIMIT 100
    `, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch activities' });
        }
        const activities = rows.map(row => ({
            ...row,
            details: JSON.parse(row.details || '{}')
        }));
        res.json(activities);
    });
});

// ========== CONTACT ROUTES ==========

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Contact Manager API is running! 🚀' });
});

// GET all contacts (public or protected - your choice)
app.get('/api/contacts', (req, res) => {
    db.all('SELECT * FROM contacts ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch contacts' });
        }

        const contacts = rows.map(row => ({
            ...row,
            tags: row.tags ? JSON.parse(row.tags) : []
        }));

        res.json(contacts);
    });
});

// GET single contact
app.get('/api/contacts/:id', (req, res) => {
    const { id } = req.params;

    db.get('SELECT * FROM contacts WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch contact' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.json({
            ...row,
            tags: row.tags ? JSON.parse(row.tags) : []
        });
    });
});

// POST create contact (PROTECTED - Admin only)
app.post('/api/contacts', authMiddleware, roleCheck(['admin']), (req, res) => {
    const { name, email, phone, company, position, tags, notes } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const tagsJSON = JSON.stringify(tags || []);

    db.run(
        `INSERT INTO contacts(id, name, email, phone, company, position, tags, notes) 
     VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, email, phone || '', company || '', position || '', tagsJSON, notes || ''],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'Email already exists' });
                }
                return res.status(500).json({ error: 'Failed to create contact' });
            }

            db.get('SELECT * FROM contacts WHERE id = ?', [id], (err, row) => {
                const contactData = {
                    ...row,
                    tags: JSON.parse(row.tags || '[]')
                };

                // Log activity
                logActivity(req.user.userId, 'CREATE_CONTACT', {
                    name: contactData.name,
                    email: contactData.email
                });

                res.status(201).json(contactData);
            });
        }
    );
});

// PUT update contact (PROTECTED - Admin only)
app.put('/api/contacts/:id', authMiddleware, roleCheck(['admin']), (req, res) => {
    const { id } = req.params;
    const { name, email, phone, company, position, tags, notes } = req.body;

    const tagsJSON = JSON.stringify(tags || []);

    db.run(
        `UPDATE contacts 
     SET name = ?, email = ?, phone = ?, company = ?, position = ?, tags = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? `,
        [name, email, phone || '', company || '', position || '', tagsJSON, notes || '', id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update contact' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Contact not found' });
            }

            db.get('SELECT * FROM contacts WHERE id = ?', [id], (err, row) => {
                const contactData = {
                    ...row,
                    tags: JSON.parse(row.tags || '[]')
                };

                // Log activity
                logActivity(req.user.userId, 'UPDATE_CONTACT', {
                    id,
                    name: contactData.name
                });

                res.json(contactData);
            });
        }
    );
});

// DELETE contact (PROTECTED - Admin only)
app.delete('/api/contacts/:id', authMiddleware, roleCheck(['admin']), (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM contacts WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete contact' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        // Log activity
        logActivity(req.user.userId, 'DELETE_CONTACT', { id });

        res.json({ message: 'Contact deleted successfully' });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 API endpoints available at http://localhost:${PORT}/api/contacts`);
    console.log(`🔐 Auth endpoints available at http://localhost:${PORT}/api/auth`);
});