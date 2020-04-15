const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const path = require('path');
const Joi = require('joi');

const db = require('./db');
const collection_name = "todo";

const schema = Joi.object().keys({
  todo: Joi.string().required()
});



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

    Joi.validate(userInput, schema, (err, result) => {
      if (err) {

          throw new Error("Invalid Input");

          // error.code = 400;
          next(error);
          console.log(next(error));
      }
    });

    db.getDB().collection('todo').insertOne(userInput, (err, result) => {
      if (err) {
        const error = new Error("Failed to insert todo document.");
        // error.code = 400;
        next(error);
      } else {
       res.json({
         result: result,
         document: result.ops[0],
         msg: "Successfully inserted!",
         error: null
       })
      }
    });
})

app.put('/:id', (req, res) => {

  const todoID = req.params.id;
  const userInput = req.body;
  console.log(userInput.todo);

  db.getDB().collection(collection_name).findOneAndUpdate({
    _id: db.getPrimaryKey(todoID)
  }, {$set : {todo: userInput.todo}},{returnOriginal : true}, (err, result) => {
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

app.use( (err, req, res, next) => {
    res.status(err.status).json({
      error: {
        message: err.message
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
