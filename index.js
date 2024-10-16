const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
 
const app = express();
const port = 3000;
 
// Set up body-parser to handle form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
// Set EJS as the templating engine (optional for HTML rendering)
app.set('view engine', 'ejs');
 
// Create connection to MySQL
const db = mysql.createConnection({
  host: 'localhost',  // Replace with your database host
  user: 'root',       // Replace with your database user
  password: 'H0b0_J0hns0n', // Replace with your database password
  database: 'character_creation_db'
});
 
// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.log('Database connection failed', err);
  } else {
    console.log('Database connected');
  }
});
 
// CRUD Routes
 
// Get all users (READ)
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      throw err;
    }
    res.render('index', { users: results });
  });
});
 
// Show form to create new user (CREATE form)
app.get('/users/new', (req, res) => {
  res.render('create');
});
 
// Add a new user (CREATE)
app.post('/users', (req, res) => {
  const { first_name, last_name, age, race, dndclass, specialization } = req.body;
  const query = 'INSERT INTO users (first_name, last_name, age, race, dndclass, specialization) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [first_name, last_name, age, race, dndclass, specialization], (err, result) => {
    if (err) {
      throw err;
    }
    res.redirect('/users');
  });
});
 
// Show edit form (READ single user for UPDATE)
app.get('/users/edit/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      throw err;
    }
    res.render('edit', { user: result[0] });
  });
});
 
// Update user (UPDATE)
app.post('/users/update/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age, race, dndclass, specialization } = req.body;
  const query = 'UPDATE users SET first_name = ?, last_name = ?, age = ?, race = ?, dndclass = ?, specialization = ? WHERE id = ?';
  db.query(query, [first_name, last_name, age, race, dndclass, specialization, id], (err, result) => {
    if (err) {
      throw err;
    }
    res.redirect('/users');
  });
});
 
// Delete a user (DELETE)
app.get('/users/delete/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      throw err;
    }
    res.redirect('/users');
  });
});
 
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


app.use(express.static("public"))
