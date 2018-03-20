'use strict';

//  ES6 object destructuring
const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');      //  return prevents the rest of the function from running
    }
    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');

    // findOneAndUpdate
    /*db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5ab17f35df833750897d2b71')
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then((res) => {
        console.log(res);
    });*/

    // findOneAndUpdate
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5ab04ce431c7c103b2baf895')
    }, {
        $set: { 
            name: 'Doug Hawkinson' 
        },
        $inc: { 
            age: 1 
        }
    }, {
        returnOriginal: false
    }).then((res) => {
        console.log(res);
    });

    //client.close()
});
