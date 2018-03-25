'use strict';

const {ObjectID} = require('mongodb');
const express    = require('express');
const bodyParser = require('body-parser');
const _          = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo}     = require('./models/todo');
const {User}     = require('./models/user');

const app        = express();

const port       = process.env.PORT || 3000;    //  set up dynamic PORT declaration

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    //  validate ID using isValid
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    //  findById
    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;
    //  validate the id -> not valid? return 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    //  remove todo by Id
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();       //  no todo send 404 & empty todo
        }
        res.send({todo});                        //  todo removed send 200 & todo
    }).catch((e) => {
        res.status(400).send();                  //  error -> return 400 with empty body
    });
});

app.patch('/todos/:id', (req, res) => {
    let id   = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);  //  subset of full body

    //  validate the id -> not valid? return 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    //  update completedAt if completed else set completedAt to null and completed to false
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();    //  js timestamp (= NOW)
    } else {
        body.completed    = false;
        body.completedAt  = null;
    }

    //  update the body of the todo and send or send error
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};