const fs = require('fs');
const express = require('express');
const path = require('path');
// This is needed to create a unique id for each note. (uses NPM package 'shortid')
const {v4 : uuidv4} = require('uuid')
const notesDb = require('./Develop/db/db.json');

const PORT = process.env.PORT || 3000

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Notes HTML route
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Notes API get route
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (error, data) =>{
        if (error) {
            throw error;
        }else {
            res.json(JSON.parse(data));
        }
    });
});

// Notes API post route
app.post('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json'));
    const newNotes = req.body;
    // create a new id for every new note
    newNotes.id = uuidv4();
    notes.push(newNotes);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes))
    res.json(notes);
});

// Notes DELETE request (bonus)
app.delete('/api/notes/:id', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json'));
    const newNotes = notes.filter(notes => notes.id !== req.params.id);
    fs.writeFileSync('./db/db.json', JSON.stringify(newNotes));
    res.json(newNotes);
});

// Homepage HTML route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// listener for port
app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`)
});
