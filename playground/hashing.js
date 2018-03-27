'use strict';

const {SHA256}  = require('crypto-js');
const jwt       = require('jsonwebtoken');


/*
//  this is the manual version

let message     = 'I am user number 3';
let hash        = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

let data        = {
    id: 4
};

let token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
};

let resultHash  = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

//  attempt to fool the hashing
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

if ( resultHash === token.hash ) {
    console.log('Data was not changed');
} else {
    console.log('Data was changed. Do NOT trust!');
}
*/

// this is the preferred method

let data = {
    id: 10
};

let token =jwt.sign(data, '123abc');
console.log(token);

let decoded =jwt.verify(token, '123abcc');
console.log('Decoded ', decoded);