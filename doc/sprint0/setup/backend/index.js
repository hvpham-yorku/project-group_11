const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json()); // Parses JSON bodies
app.use(cors()); // Allows cross-origin requests

// Set up PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Ryan2003',
    port: 5432, // Default PostgreSQL port
});

// Define a POST route to add a user
app.post('/addUser', async (req, res) => {
    const { name } = req.body;
    try {
        const result = await pool.query('INSERT INTO users (name) VALUES ($1) RETURNING *', [name]);
        res.status(200).json(result.rows[0]); // Respond with the added user
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));