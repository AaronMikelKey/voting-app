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

// Get all candidates
app.get('/api/candidate(s)?', (req, res) => {
	db.query(`SELECT * FROM candidates`, (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message })
			return
	}
		res.json({
			message: 'Success',
			data: rows
		})
	})
})

// Get single candidate
app.get('/api/candidate/:id', (req, res) => {
	const query = `SELECT * FROM candidates WHERE id = ?`
	const id = req.params.id 

	db.query(query, id, (err, row) => {
		if (err) {
			res.status(400).json({ error : err.message })
			return
		} else if (row = '[]') {
			res.json({
				message: 'No candidate with that ID, please try another or add a candidate with that ID.'
			})
		}
		res.json({
			message: 'Success',
			data: row
		})
	})
})

// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
  const query = `DELETE FROM candidates WHERE id = ?`;
  const id = [req.params.id];

  db.query(query, id, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

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