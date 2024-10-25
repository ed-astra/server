var mongoose = require('mongoose')
var schema = mongoose.Schema;
var bcrypt = require('bcrypt')
var userScheme = new schema({
    email: {
        type: String,
        require: true,
    },
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    dob: {
        type: String,
        require: true,
    },
    type: {
        type: String,
        require: true,
    },
    roll_no: {
        type: String,
        require: true,
    }
})

userScheme.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return next(err)
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err)
                }
                user.password = hash;
                next()
            })
        })
    }
    else {
        next()
    }
})

userScheme.methods.comparePasswords = function(password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if(err) {
            return cb(err)
        }
        else{
            cb(null, isMatch)
        }
    })
}

module.exports = mongoose.model('test_users', userScheme,)