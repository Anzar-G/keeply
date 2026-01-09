const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
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
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Pool error handling
pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle database client', err);
});

const initDb = async () => {
    try {
        console.log('⏳ Initializing database...');

        // Test connection
        await pool.query('SELECT NOW()');
        console.log('✅ Connected to Neon PostgreSQL database');

        // Create tables
        await pool.query(`
            CREATE TABLE IF NOT EXISTS contacts (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(50),
                company VARCHAR(255),
                position VARCHAR(255),
                tags TEXT,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS activity_logs (
                id VARCHAR(255) PRIMARY KEY,
                user_id VARCHAR(255),
                contact_id VARCHAR(255),
                action VARCHAR(100) NOT NULL,
                details TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Migration: ensure contact_id exists if table was already created
        try {
            await pool.query('ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS contact_id VARCHAR(255)');
        } catch (e) {
            // Log column existence error if any, ignore otherwise
        }

        await pool.query(`
            CREATE TABLE IF NOT EXISTS contact_notes (
                id VARCHAR(255) PRIMARY KEY,
                contact_id VARCHAR(255) REFERENCES contacts(id) ON DELETE CASCADE,
                user_id VARCHAR(255) REFERENCES users(id),
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS contact_groups (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                color VARCHAR(20) DEFAULT '#4338ca',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS contact_group_members (
                contact_id VARCHAR(255),
                group_id VARCHAR(255),
                PRIMARY KEY (contact_id, group_id),
                FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
                FOREIGN KEY (group_id) REFERENCES contact_groups(id) ON DELETE CASCADE
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(255) PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'viewer',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Check for default admin
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@example.com']);
        if (rows.length === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
            await pool.query(
                'INSERT INTO users (id, username, email, password, role) VALUES ($1, $2, $3, $4, $5)',
                [id, 'admin', 'admin@example.com', hashedPassword, 'admin']
            );
            console.log('👤 Default admin user created: admin@example.com / admin123');
        }
        console.log('🏁 Database tables verified/created');
    } catch (err) {
        console.error('❌ Database initialization failed:', err);
        // Don't exit process, let the server run so we can see error logs
    }
};

initDb();

// Generic error handling for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Helper function to log activity
const logActivity = async (userId, action, details, contactId = null) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    try {
        await pool.query(
            'INSERT INTO activity_logs (id, user_id, contact_id, action, details) VALUES ($1, $2, $3, $4, $5)',
            [id, userId, contactId, action, JSON.stringify(details || {})]
        );
    } catch (err) {
        console.error('❌ Failed to log activity:', err);
    }
};

// ========== AUTH ROUTES ==========

// Register new user
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }

        // Check if user already exists
        const { rows: existingUsers } = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const userRole = role || 'viewer';

        // Insert user
        await pool.query(
            'INSERT INTO users (id, username, email, password, role) VALUES ($1, $2, $3, $4, $5)',
            [id, username, email, hashedPassword, userRole]
        );

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
    } catch (error) {
        console.error('Registration Error:', error);
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
        const { rows: users } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = users[0];

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
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user
app.get('/api/auth/me', authMiddleware, async (req, res) => {
    try {
        const { rows: users } = await pool.query('SELECT id, username, email, role, created_at FROM users WHERE id = $1', [req.user.userId]);
        const user = users[0];

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ========== ACTIVITY LOG ROUTES ==========

// GET all activities (Admin only)
app.get('/api/activities', authMiddleware, roleCheck(['admin']), async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT al.*, u.username as actor 
            FROM activity_logs al 
            LEFT JOIN users u ON al.user_id = u.id 
            ORDER BY al.created_at DESC 
            LIMIT 100
        `);

        const activities = rows.map(row => ({
            ...row,
            details: JSON.parse(row.details || '{}')
        }));
        res.json(activities);
    } catch (error) {
        console.error('Fetch Activities Error:', error);
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

// ========== CONTACT ROUTES ==========

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Contact Manager API is running! 🚀' });
});

// GET all contacts with Advanced Filtering
app.get('/api/contacts', async (req, res) => {
    try {
        const { company, tag, group, dateFrom, dateTo, search } = req.query;
        let query = 'SELECT c.* FROM contacts c';
        let params = [];
        let conditions = [];

        if (group) {
            query += ' JOIN contact_group_members cgm ON c.id = cgm.contact_id';
            conditions.push('cgm.group_id = $' + (params.length + 1));
            params.push(group);
        }

        if (company) {
            conditions.push('c.company ILIKE $' + (params.length + 1));
            params.push(`%${company}%`);
        }

        if (tag) {
            conditions.push('c.tags LIKE $' + (params.length + 1));
            params.push(`%${tag}%`);
        }

        if (dateFrom) {
            conditions.push('c.created_at >= $' + (params.length + 1));
            params.push(dateFrom);
        }

        if (dateTo) {
            // Make dateTo inclusive of the entire day
            conditions.push('c.created_at <= $' + (params.length + 1));
            params.push(`${dateTo} 23:59:59`);
        }

        if (search) {
            const searchPattern = `%${search}%`;
            conditions.push('(c.name ILIKE $' + (params.length + 1) +
                ' OR c.email ILIKE $' + (params.length + 2) +
                ' OR c.company ILIKE $' + (params.length + 3) +
                ' OR c.position ILIKE $' + (params.length + 4) + ')');
            params.push(searchPattern, searchPattern, searchPattern, searchPattern);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY c.created_at DESC';

        const { rows } = await pool.query(query, params);

        const contacts = rows.map(row => ({
            ...row,
            tags: row.tags ? JSON.parse(row.tags) : []
        }));

        res.json(contacts);
    } catch (error) {
        console.error('Filtering Error:', error);
        res.status(500).json({ error: 'Failed to fetch contacts with filters' });
    }
});

// GET single contact with Group info
app.get('/api/contacts/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query(`
            SELECT c.*, g.id as group_id, g.name as group_name, g.color as group_color
            FROM contacts c
            LEFT JOIN contact_group_members cgm ON c.id = cgm.contact_id
            LEFT JOIN contact_groups g ON cgm.group_id = g.id
            WHERE c.id = $1
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        const row = rows[0];
        res.json({
            ...row,
            tags: row.tags ? JSON.parse(row.tags) : [],
            group: row.group_id ? { id: row.group_id, name: row.group_name, color: row.group_color } : null
        });
    } catch (error) {
        console.error('Fetch Contact Error:', error);
        res.status(500).json({ error: 'Failed to fetch contact' });
    }
});

// GET contact notes
app.get('/api/contacts/:id/notes', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query(`
            SELECT n.*, u.username as creator_name 
            FROM contact_notes n
            LEFT JOIN users u ON n.user_id = u.id
            WHERE n.contact_id = $1
            ORDER BY n.created_at DESC
        `, [id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

// POST create contact note
app.post('/api/contacts/:id/notes', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        if (!content) return res.status(400).json({ error: 'Content is required' });

        const noteId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        await pool.query(
            'INSERT INTO contact_notes (id, contact_id, user_id, content) VALUES ($1, $2, $3, $4)',
            [noteId, id, req.user.userId, content]
        );

        // Fetch the created note with creator info
        const { rows } = await pool.query(`
            SELECT n.*, u.username as creator_name 
            FROM contact_notes n
            LEFT JOIN users u ON n.user_id = u.id
            WHERE n.id = $1
        `, [noteId]);

        logActivity(req.user.userId, 'ADD_NOTE', { contact_id: id }, id);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Note Creation Error:', error);
        res.status(500).json({ error: 'Failed to add note' });
    }
});

// GET contact timeline (Combined Activities and Notes)
app.get('/api/contacts/:id/timeline', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch activities filtered for this contact
        const { rows: activities } = await pool.query(`
            SELECT a.*, u.username as actor_name, 'activity' as type
            FROM activity_logs a
            LEFT JOIN users u ON a.user_id = u.id
            WHERE a.contact_id = $1 OR a.details LIKE $2
            ORDER BY a.created_at DESC
        `, [id, `%${id}%`]);

        const { rows: notes } = await pool.query(`
            SELECT n.*, u.username as actor_name, 'note' as type
            FROM contact_notes n
            LEFT JOIN users u ON n.user_id = u.id
            WHERE n.contact_id = $1
            ORDER BY n.created_at DESC
        `, [id]);

        // Combine and sort
        const timeline = [...activities, ...notes].sort((a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
        );

        res.json(timeline);
    } catch (error) {
        console.error('Timeline Fetch Error:', error);
        res.status(500).json({ error: 'Failed to fetch timeline' });
    }
});

// Bulk Create Contacts (Admin only)
app.post('/api/contacts/bulk', authMiddleware, roleCheck(['admin']), async (req, res) => {
    const { contacts, strategy = 'error' } = req.body;

    if (!Array.isArray(contacts) || contacts.length === 0) {
        return res.status(400).json({ error: 'At least one contact is required' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const insertedContacts = [];
        console.log(`📦 Bulk Ingestion Started: ${contacts.length} records | Strategy: ${strategy}`);

        for (const contact of contacts) {
            const { name, email, phone, company, position, tags, notes, group_id } = contact;

            if (!name || !email) {
                throw new Error('Name and email are required for all contacts');
            }

            // Strategy: Skip
            if (strategy === 'skip') {
                const { rows: existing } = await client.query('SELECT id FROM contacts WHERE email = $1', [email]);
                if (existing.length > 0) {
                    console.log(` -> Skipping existing email: ${email}`);
                    continue;
                }
            }

            const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
            const tagsJSON = JSON.stringify(tags || []);

            let query = `
                INSERT INTO contacts (id, name, email, phone, company, position, tags, notes) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `;
            let params = [id, name, email, phone || '', company || '', position || '', tagsJSON, notes || ''];

            if (strategy === 'overwrite') {
                query += `
                    ON CONFLICT (email) 
                    DO UPDATE SET 
                        name = EXCLUDED.name,
                        phone = EXCLUDED.phone,
                        company = EXCLUDED.company,
                        position = EXCLUDED.position,
                        tags = EXCLUDED.tags,
                        notes = EXCLUDED.notes,
                        updated_at = CURRENT_TIMESTAMP
                    RETURNING *
                `;
            } else {
                query += ` RETURNING *`;
            }

            const { rows } = await client.query(query, params);
            const finalContact = rows[0];

            // Handle group association (only if it's a new association or overwriting)
            if (group_id) {
                await client.query(
                    'INSERT INTO contact_group_members (contact_id, group_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                    [finalContact.id, group_id]
                );
            }

            // Log activity
            logActivity(req.user.userId, 'CREATE_CONTACT', { name, email, source: 'bulk_import', strategy }, finalContact.id);

            insertedContacts.push(finalContact);
        }

        await client.query('COMMIT');
        res.status(201).json(insertedContacts);
    } catch (error) {
        if (client) await client.query('ROLLBACK');
        console.error('Error in bulk import:', error);
        res.status(500).json({ error: error.message || 'Failed to import contacts' });
    } finally {
        if (client) client.release();
    }
});

// POST create contact (PROTECTED - Admin only)
app.post('/api/contacts', authMiddleware, roleCheck(['admin']), async (req, res) => {
    try {
        const { name, email, phone, company, position, tags, notes } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        // Check for duplicate email manually for better error message
        const { rows: existing } = await pool.query('SELECT id FROM contacts WHERE email = $1', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'A contact with this email already exists in your registry.' });
        }

        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const tagsJSON = JSON.stringify(tags || []);

        await pool.query(
            `INSERT INTO contacts(id, name, email, phone, company, position, tags, notes) 
             VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
            [id, name, email, phone || '', company || '', position || '', tagsJSON, notes || '']
        );

        const { rows } = await pool.query('SELECT * FROM contacts WHERE id = $1', [id]);
        const contactData = {
            ...rows[0],
            tags: JSON.parse(rows[0].tags || '[]')
        };

        // Log activity
        logActivity(req.user.userId, 'CREATE_CONTACT', {
            name: contactData.name,
            email: contactData.email
        }, id);

        res.status(201).json(contactData);
    } catch (err) {
        if (err.code === '23505') { // Postgres Duplicate key
            return res.status(409).json({ error: 'Email already exists' });
        }
        console.error('Create Contact Error:', err);
        res.status(500).json({ error: 'Failed to create contact' });
    }
});

// PUT update contact (PROTECTED - Admin only)
app.put('/api/contacts/:id', authMiddleware, roleCheck(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, company, position, tags, notes } = req.body;

        // Check for duplicate email (excluding self)
        const { rows: existing } = await pool.query('SELECT id FROM contacts WHERE email = $1 AND id != $2', [email, id]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'This email is already associated with another contact.' });
        }

        const tagsJSON = JSON.stringify(tags || []);

        const result = await pool.query(
            `UPDATE contacts 
             SET name = $1, email = $2, phone = $3, company = $4, position = $5, tags = $6, notes = $7, updated_at = CURRENT_TIMESTAMP
             WHERE id = $8`,
            [name, email, phone || '', company || '', position || '', tagsJSON, notes || '', id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        const { rows } = await pool.query('SELECT * FROM contacts WHERE id = $1', [id]);
        const contactData = {
            ...rows[0],
            tags: JSON.parse(rows[0].tags || '[]')
        };

        // Log activity
        logActivity(req.user.userId, 'UPDATE_CONTACT', {
            id,
            name: contactData.name
        }, id);

        res.json(contactData);
    } catch (err) {
        console.error('Update Contact Error:', err);
        res.status(500).json({ error: 'Failed to update contact' });
    }
});

// DELETE contact (PROTECTED - Admin only)
app.delete('/api/contacts/:id', authMiddleware, roleCheck(['admin']), async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('DELETE FROM contacts WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        // Log activity
        logActivity(req.user.userId, 'DELETE_CONTACT', { id }, id);

        res.json({ message: 'Contact deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

// ========== CONTACT GROUP ROUTES ==========

// GET all groups with counts
app.get('/api/groups', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT g.*, COUNT(cgm.contact_id) as contact_count 
            FROM contact_groups g 
            LEFT JOIN contact_group_members cgm ON g.id = cgm.group_id 
            GROUP BY g.id, g.name, g.color, g.created_at
            ORDER BY g.name ASC
        `);
        res.json(rows);
    } catch (err) {
        console.error('Fetch Groups Error:', err);
        res.status(500).json({ error: 'Failed to fetch groups' });
    }
});

// POST create group (Admin only)
app.post('/api/groups', authMiddleware, roleCheck(['admin']), async (req, res) => {
    try {
        const { name, color } = req.body;
        if (!name) return res.status(400).json({ error: 'Group name is required' });

        const id = 'group_' + Date.now().toString() + Math.random().toString(36).substr(2, 5);
        await pool.query(
            'INSERT INTO contact_groups (id, name, color) VALUES ($1, $2, $3)',
            [id, name, color || '#4338ca']
        );
        logActivity(req.user.userId, 'CREATE_GROUP', { name });
        res.status(201).json({ id, name, color });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create group' });
    }
});

// DELETE group (Admin only)
app.delete('/api/groups/:id', authMiddleware, roleCheck(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM contact_groups WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Group not found' });
        }
        logActivity(req.user.userId, 'DELETE_GROUP', { id });
        res.json({ message: 'Group deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete group' });
    }
});

// POST bulk assign contacts to group (Admin only)
app.post('/api/contacts/bulk-group', authMiddleware, roleCheck(['admin']), async (req, res) => {
    try {
        const { contactIds, groupId } = req.body;
        if (!contactIds || !Array.isArray(contactIds) || !groupId) {
            return res.status(400).json({ error: 'Invalid selection or group ID' });
        }

        // PostgreSQL bulk insert with conflict handling
        const values = contactIds.map((cId, idx) => `($${idx * 2 + 1}, $${idx * 2 + 2})`).join(', ');
        const params = [];
        contactIds.forEach(cId => params.push(cId, groupId));

        const query = `INSERT INTO contact_group_members (contact_id, group_id) VALUES ${values} ON CONFLICT DO NOTHING`;

        const result = await pool.query(query, params);
        logActivity(req.user.userId, 'BULK_ASSIGN_GROUP', { count: contactIds.length, groupId });
        res.json({ message: `Successfully assigned contacts to group` });
    } catch (err) {
        console.error('Bulk Assign Error:', err);
        res.status(500).json({ error: 'Failed to assign contacts to group' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 API endpoints available at http://localhost:${PORT}/api/contacts`);
    console.log(`🔐 Auth endpoints available at http://localhost:${PORT}/api/auth`);
});