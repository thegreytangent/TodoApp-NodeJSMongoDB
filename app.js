const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const path = require('path');

const db = require('./db');
const collection_name = "todo";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/getTodos", (req, res) => {
    db.getDB().collection(collection_name).find({}).toArray((err, doc) => {
        if (err) {
            console.log(err);
        } else {
            console.log(doc);
            res.json(doc);
        }
    });
})


db.connect((err) => {
    if (err) {
        console.log("unable to connect to database");
        process.exit(1);
    } else {
        app.listen(3000, () => {
            console.log("app is listening on 3000");
        });
    }
})