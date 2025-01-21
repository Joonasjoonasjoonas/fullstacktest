const express = require('express');
const cors = require('cors');
const pool = require('./db/connection');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root path handler
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Example API endpoint to test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1 + 1 AS solution');
    res.json({ 
      message: 'Database connection successful',
      data: result 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Add this new endpoint
app.get('/api/customers', async (req, res) => {
  try {
    const [customers] = await pool.query('SELECT * FROM customers');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch customers',
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 