const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 1337;

const { getAllBoats, getBoat, addBoat, deleteBoat, search } = require('./database.js');



// **** Middleware ****
app.use( express.static(__dirname + '/../public') )
app.use( (req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next()
} )
app.use( bodyParser.urlencoded({ extended: true }) )
app.use( bodyParser.json() )


// GET 
app.get('/api/boats', (req, res) => {
	getAllBoats(dataOrError => {
		res.send(dataOrError)
	});
})

// GET 
app.get('/api/boat', (req, res) => {
	getBoat(req.query.id, dataOrError => {
		res.send(dataOrError)
	})
})

// POST//ingen frontend
app.post('/api/boat?', (req, res) => {
	addBoat(req.body, dataOrError => {
		res.send(dataOrError)
	})
})


//search
app.get('/api/search', (req, res) => {
	console.log('Search route');
	search(req.query, dataOrError => {
		res.send(dataOrError)
	})
})

// DELETE
app.delete('/api/delete', (req, res) => {
	console.log('delete');
	deleteBoat(req.query.id, dataOrError => {
		res.send(dataOrError)
	})
})




// ****Starta webbservern ****
app.listen(port, () => console.log('Server is listening on port ' + port))