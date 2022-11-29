const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'login-socket'
});

const app = express();
const router = express.Router();
const emailValidator = require ('deep-email-validator');

async function isEmailValid(email){
	return emailValidator.validate(email)
}

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// http://localhost:3000/
app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/login.html'));
});

// http://localhost:3000/
app.get('/register', function(request, response) {
	// Render login template
		if (request.method == 'POST'){
			response.sendFile(path.join(__dirname + '/main.html'));
		}
	response.sendFile(path.join(__dirname + '/register.html'));
});

// router.post('/check', async function(req, res, next) {
// 	const {email, password} = req.body;
    
// 	if (!email || !password){
// 	  return res.status(400).send({
// 		message: "Email or password missing."
// 	  })
// 	}
  
// 	const {valid, reason, validators} = await isEmailValid(email);
  
// 	if (valid) return res.sendFile(path.join(__dirname + '/main.html'));
// 	// res.send({message: "OK"});
  
// 	return res.status(400).send({
// 	  message: "Please provide a valid email address.",
// 	  reason: validators[reason].reason
// 	})
  
// });

app.get('/main', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/main.html'));
});

// http://localhost:3000/auth
app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/home');
			} else {
				response.send('Usuario y/o Contraseña Incorrecta');
			}			
			response.end();
		});
	} else {
		response.send('Por favor ingresa Usuario y Contraseña!');
		response.end();
	}
});

// http://localhost:3000/home
app.get('/home', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.send('Te has logueado satisfactoriamente:, ' + request.session.username + '!');
	} else {
		// Not logged in
		response.send('¡Inicia sesión para ver esta página!');
	}
	response.end();
});

app.listen(3000);