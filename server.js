// Dependencies
// .env variables
require('dotenv').config();
// Port and MONGODB_URL from .env
const { PORT = 3000, MONGODB_URL } = process.env;
// Express
const express = require('express');
// App object
const app = express();
// Mongoose import
const mongoose = require('mongoose');
// Middleware import
const cors = require('cors');
const morgan = require('morgan');

// Database connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
// Connection events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// Models
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
});

const People = mongoose.model("People", PeopleSchema);

// Middleware
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan('dev')); // logging
app.use(express.json()); // parse json bodies

// Routes
// Test Route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// People index route
app.get('/people',  async (req,res) => {
    try {
        // send all people
        res.json(await People.find({}));
    } catch (error) {
        // send error
        res.status(400).json(error);
    }
});

// People create route
app.post('/people', async (req, res) => {
    try {
        // send all people
        res.json(await People.create(req.body));
    } catch (error) {
        // send error
        res.status(400).json(error);
    }
});

// People delete route
app.delete('/people/:id', async (req, res) => {
    try {
        // send all people
        res.json(await People.findByIdAndRemove(req.params.id));
    } catch (error) {
        // send error
        res.status(400).json(error);
    }
});

// People update route
app.put('/people/:id', async (req, res) => {
    try {
        // send all people
        res.json(
            await People.findByIdAndUpdate(req.params.id, req.body, { new: true })
        );
    } catch (error) {
        // send error
        res.status(400).json(error);
    }
});

// Listener
app.listen(PORT, () => console.log('Listening on PORT ' + PORT));