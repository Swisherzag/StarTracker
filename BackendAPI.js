const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
    user: 'your_username',
    host: 'your_host',
    database: 'your_database',
    password: 'your_password',
    port: 5432,
});

// User Registration
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        res.json(newUser.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// User Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }
        const token = jwt.sign({ user_id: user.rows[0].id }, 'your_secret_key');
        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Authentication Middleware
const authenticateUser = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ error: 'Access Denied' });
    }
    try {
        const verified = jwt.verify(token, 'jsonwebtoken');
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid Token' });
    }
};

// Protected Route
app.get('/protected', authenticateUser, (req, res) => {
    res.json({ message: 'This is a protected route.', user: req.user });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
