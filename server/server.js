'use strict';

require('./config/config');     //  configure the app

const _              = require('lodash');
const express        = require('express');
const bodyParser     = require('body-parser');
const {ObjectID}     = require('mongodb');

const {mongoose}     = require('./db/mongoose');
const {Todo}         = require('./models/todo');
const {User}         = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app            = express();
const port           = process.env.PORT || 3000;    //  set up dynamic PORT declaration

app.use(bodyParser.json());

/*==================================================
    Todos routes
==================================================*/
app.post('/todos', authenticate, (req, res) => {
    let todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    //  validate ID using isValid
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    //  findById
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    //  validate the id -> not valid? return 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    //  remove todo by Id
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();       //  no todo send 404 & empty todo
        }
        res.send({todo});                        //  todo removed send 200 & todo
    }).catch((e) => {
        res.status(400).send();                  //  error -> return 400 with empty body
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
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
    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, 
    {$set: body}, 
    {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    })
});

/*==================================================
    Users routes
==================================================*/
app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user); //  send custom header (x-)
    }).catch((e) => {
        res.status(400).send(e);
    })
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }). catch((e) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};