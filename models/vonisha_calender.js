var mongoose = require('mongoose')
var schema = mongoose.Schema;
var bcrypt = require('bcrypt')
var userScheme = new schema({

    month: {
        type: String,
        require: true,
    },
    data: {
        type: Array,
        require: true,
    }
})

module.exports = mongoose.model('vonisha_calander', userScheme,)