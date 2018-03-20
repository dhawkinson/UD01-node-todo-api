'use strict';

// const MongoClient = require('mongodb').MongoClient;
//  ES6 object destructuring
const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');      //  return prevents the rest of the function from running
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

/*
    //  insert a document into collection Todos (text, completed)
    db.collection('Todos').insertOne({
        text: 'Walk the dog',
        completed: false
    }, (err, res) => {
        if (err) {
            return console.log('Unable to insert todo', err);
        }
        console.log(JSON.stringify(res.ops, undefined, 4));
    });
*/

/*
    //  insert a document in a new collection, Users - (name, age, location)
    db.collection('Users').insertOne({
        name: 'Doug Hawkinson',
        age: 72,
        location: 'Seattle'
    }, (err, res) => {
        if (err) {
            return console.log('Unable to insert user', err);
        }
        console.log(res.ops[0]._id.getTimestamp());
    });
*/

    client.close()
});
