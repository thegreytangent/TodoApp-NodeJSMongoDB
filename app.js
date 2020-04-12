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
});

app.post("/", (req, res) => {
    const userInput  = req.body;
    db.getDB().collection('todo').insertOne(userInput, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
       res.json({
         result: result,
         document: result.ops[0]
       })
      }
    });
})

app.put('/:id', (req, res) => {

  const todoID = req.params.id;
  const userInput = req.body;
  console.log(userInput.todo);

  db.getDB().collection(collection_name).findOneAndUpdate({_id: db.getPrimaryKey(todoID)}, {$set : {todo: userInput.todo}},{returnOriginal : true}, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
        console.log(result);
        res.json(result);
    }

  })
});

app.delete('/:id', (req, res) => {
  const todoID = req.params.id;
  db.getDB().collection('todo').findOneAndDelete({
    _id: db.getPrimaryKey(todoID)
  }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json({
        result: result
      });
    }
  });
});




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
