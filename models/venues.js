var mongoose = require('mongoose')
var schema = mongoose.Schema;
var bcrypt = require('bcrypt')
var userScheme = new schema({

    name: {
        type: String,
        require: true,
    },
    capacity: {
        type: String,
        require: true,
    },
    type: {
        type: String,
        require: true,
    },
    id: {
        type: String,
        require: true,
    },
})


module.exports = mongoose.model('venues', userScheme,)