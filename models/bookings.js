var mongoose = require('mongoose')
var schema = mongoose.Schema;
var bcrypt = require('bcrypt')
var userScheme = new schema({

    date: {
        type: String,
        require: true,
    },
    venue: {
        type: String,
        require: true,
    },
    data: {
        type: Array,
        require: true,
    },

})


module.exports = mongoose.model('bookings', userScheme,)