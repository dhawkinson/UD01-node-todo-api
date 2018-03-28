'use strict';

const mongoose   = require('mongoose');
const validator  = require('validator');
const jwt        = require('jsonwebtoken');
const _          = require('lodash');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

/*========================================
    instance methods
========================================*/

//  set the exact values to send back to the user
UserSchema.methods.toJSON  = function() {
    let user       = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
    let user   = this;
    let access = 'auth';
    let token  = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    // user.tokens.push({access, token})    -   deprecated method (see next)
    user.tokens = user.tokens.concat([{access, token}]);    // mitigates problem encountered between MongoDB versions

    //  save the item, passing token into the then callback (next middleware)
    return user.save().then(() => {
        return token;
    });
};

/*========================================
    model methods
========================================*/
UserSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }

    //  success
    return User.findOne({
        '_id': decoded._id,
        // looking within the tokens array, hence the wrapper of ''
        'tokens.token': token,
        'tokens.access': 'auth'
    })
};

const User     = mongoose.model('User', UserSchema);

module.exports = {User};
