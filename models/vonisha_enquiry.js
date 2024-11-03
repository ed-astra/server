var mongoose = require('mongoose')
var schema = mongoose.Schema;
var bcrypt = require('bcrypt')
var userScheme = new schema({

    date: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    number: {
        type: String,
        require: true,
    },
    remarks: {
        type: String,
        require: true,
    }
})

module.exports = mongoose.model('vonisha_enquiries', userScheme,)