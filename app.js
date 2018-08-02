const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const CLUE_TOTAL = 215815;
let db = new sqlite3.Database('clues.db', sqlite3.OPEN_READONLY, (err) => {
    if(err){
        return console.log(err.message);
    }
    console.log("Connected to SQLite database.");
});


app.get('/', (req, res) => res.send("Hello World!"));

app.get('/random_question', (req, res) => {
    const rand_id = Math.floor(Math.random() * 215815) + 1;
    const sql = `SELECT documents.clue, documents. answer, categories.category, clues.id, classifications.catid
                 FROM clues
                 JOIN classifications ON clues.id = classifications.clueid
                 JOIN categories ON classifications.catid = categories.id
                 JOIN documents ON clues.id = documents.id
                 WHERE clues.id = ${rand_id}
                 `;
    //const sql = `SELECT * FROM clues WHERE clues.id = ${rand_id}`;
    db.each(sql, (err, row) => {
        if(err){
            console.log(err.message);
            throw err;
        }
        res.send(row);
    });
});

app.listen(3000, () => console.log('Listening on port 3000'));