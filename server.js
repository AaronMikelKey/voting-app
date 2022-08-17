const express = require('express')
const createError = require('http-errors')
const mysql = require('mysql2')
require('dotenv').config();

const PORT = process.env.port || 3001
const app = express()

//db connection
const db = mysql.createConnection(
	{
		host: 'localhost',
		user: 'root',
		password: process.env.password,
		database: 'election'
	},
	console.log('Connected to election database.')
)

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

db.query(`SELECT * FROM candidates`, (err, rows) => {
	console.log(rows)
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.send(`Error: ${err.message}`)
});

app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`)
})