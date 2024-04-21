const fs = require('fs');
const express = require('express');
const path = require('path');
// This is needed to create a unique id for each note. (uses NPM package 'shortid')
const {v4 : uuidv4} = require('uuid')
const notesDb = require('./db/db.json');

const PORT = process.env.PORT || 3000

const app = express();

// Middleware
app.use(express.static('public'));

// Notes HTML route
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});
// Homepage HTML route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Notes API get route
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (error, data) =>{
        if (error) {
            throw error;
        }else {
            res.json(JSON.parse(data));
        }
    });
    
});

// Notes API post route
app.post('/api/notes', (req, res) => {
// TODO: Debug, fix JSON.parse (syntax error)
    const notes = JSON.parse(notesDb)
    const newNotes = req.body;
    newNotes.id = uuidv4();
    notes.push(newNotes);
    fs.writeFile('./db/db.json', JSON.stringify(notes))
    res.json(notes);
})

// Notes DELETE request
app.delete('/api/notes/:id', (req, res) => {
// TODO: add code for app.delete
});

// listener for port
app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
});
