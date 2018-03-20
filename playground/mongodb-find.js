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
        db.collection('Todos').find({
            _id: new ObjectID('5ab031b9467d7b79107a1482')
        }).toArray().then((docs) => {
            console.log('Todos');
            console.log(JSON.stringify(docs, undefined, 4));
        }, (err) => {
            console.log('Unable to fetch todos', err);
        });
    */
    
    /*
        db.collection('Todos').find().count().then((count) => {
            console.log(`Todos Count: ${count}`);
        }, (err) => {
            console.log('Unable to fetch todos', err);
        });
    */
    
    db.collection('Users').find({name: 'Doug Hawkinson'}).toArray().then((docs) => {
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 4));
    }, (err) => {
        console.log('Unable to fetch users', err);
    });

    //client.close()
});
