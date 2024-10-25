var mongoose = require('mongoose')
var schema = mongoose.Schema;
var bcrypt = require('bcrypt')
var userScheme = new schema({

    id: {
        type: String,
        require: true,
    },
    venue: {
        type: String,
        require: true,
    },
    repeat: {
        type: String,
        require: true,
    },
    data: {
        type: Array,
        require: true,
    },
    user: {
        type: String,
        require: true,
    },

})


module.exports = mongoose.model('bookings_details', userScheme,)