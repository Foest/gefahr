const express = require('express');
const app = express();
var path = require('path');
const sqlite3 = require('sqlite3').verbose();
const CLUE_TOTAL = 215815;

let db = new sqlite3.Database('clues.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        return console.log(err.message);
    }
    console.log("Connected to SQLite database.");
});

app.use(express.static(__dirname));

app.use(express.json());

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/views/index.html')));

app.get('/random', (req, res) => res.sendFile(path.join(__dirname + '/views/random.html')));

app.get('/game', (req, res) => res.sendFile(path.join(__dirname + '/views/game.html')));

app.get('/random_question', (req, res) => {
    //Get a random clue id
    const rand_id = Math.floor(Math.random() * 215815) + 1;

    const sql = `SELECT documents.clue, documents.answer, categories.category, clues.value, clues.round, clues.id, classifications.catid
                 FROM clues
                 JOIN classifications ON clues.id = classifications.clueid
                 JOIN categories ON classifications.catid = categories.id
                 JOIN documents ON clues.id = documents.id
                 WHERE clues.id = ${rand_id}
                 `;
    db.each(sql, (err, row) => {
        if (err) {
            console.log(err.message);
            throw err;
        }
        //res.send(row);
        res.json(row);
    });
});

app.post('/random_question', (req, res) => {
    //Get a random clue id
    const mode = req.body.mode;
    const rand_id = Math.floor(Math.random() * 215815) + 1;
    let sql;
    const sqlRandom = `SELECT documents.clue, documents.answer, categories.category, clues.value, clues.round, clues.id, classifications.catid
                 FROM clues
                 JOIN classifications ON clues.id = classifications.clueid
                 JOIN categories ON classifications.catid = categories.id
                 JOIN documents ON clues.id = documents.id
                 WHERE clues.id = ${rand_id}
                 `;

    const sqlEasy = `SELECT documents.clue, documents.answer, categories.category, clues.value, clues.round, clues.id, classifications.catid
                 FROM clues
                 JOIN classifications ON clues.id = classifications.clueid
                 JOIN categories ON classifications.catid = categories.id
                 JOIN documents ON clues.id = documents.id
                 WHERE value < 600 AND value > 0 AND round < 3
                 ORDER BY RANDOM() LIMIT 1;
                 `;

    mode === 'easy' ? sql = sqlEasy : sql = sqlRandom;
    db.each(sql, (err, row) => {
        if (err) {
            console.log(err.message);
            throw err;
        }
        if(row.round === 3) row.value = 2000;
        res.json(row);
    });
});

app.post('/random_game', (req, res) => {
    //Get a random clue id
    const mode = req.body.mode;
    const rand_game = Math.floor(Math.random() * 3970) + 1;
    const sql = `SELECT documents.clue, documents.answer, categories.category, clues.value, clues.round, clues.id, classifications.catid
                 FROM clues
                 JOIN classifications ON clues.id = classifications.clueid
                 JOIN categories ON classifications.catid = categories.id
                 JOIN documents ON clues.id = documents.id
                 JOIN airdates ON clues.game = airdates.game
                 WHERE airdates.game = ${rand_game}
                 `;

    db.all(sql, (err, rows) => {
        if (err) {
            console.log(err.message);
            throw err;
        }
        res.json(rows);
    });
});

app.listen(3000, () => console.log('Listening on port 3000'));