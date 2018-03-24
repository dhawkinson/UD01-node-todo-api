'use strict';

const {ObjectID}    = require('mongodb');

const {mongoose}    = require('./../server/db/mongoose');
const {Todo}        = require('./../server/models/todo');
const {User}        = require('./../server/models/user');

//  Todo remove
/* Todo.remove({}).then((res) => {
    console.log(res);
});*/

//  find and remove
Todo.findOneAndRemove({_id: '5ab5900adf833750897e4edf'}).then((todo) => {
    console.log(todo);
});

//  find by ID and remove
Todo.findByIdAndRemove('5ab5900adf833750897e4edf').then((todo) => {
    console.log(todo);
});