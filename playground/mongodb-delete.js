'use strict';

//  ES6 object destructuring
const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');      //  return prevents the rest of the function from running
    }
    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');

    //  delete Many
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((res) => {
    //     console.log(res);
    // });

    //  delete One
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((res) => {
    //     console.log(res);
    // });

    //  find One & delete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((res) => {
    //     console.log(res);
    // });

    // db.collection('Users').deleteMany({name: 'Doug Hawkinson'}).then((res) => {
    //     console.log(res);
    // });

    //  find One & delete
    db.collection('Users').findOneAndDelete({_id: new ObjectID('5ab04d00b3453703b3ae2332')}).then((res) => {
        console.log(res);
    });

    //client.close()
});
