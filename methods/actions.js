var User = require('../models/user')
var VonishaUser = require('../models/vonisha_user')
var Venue = require('../models/venues')
var Bookings = require('../models/bookings')
var BookingDetails = require('../models/booking_details')
var Students = require('../models/students.js')

var jwt = require('jwt-simple')
var config = require('../config/dbConfig')
const bcrypt = require('bcrypt')
var otpGenerator = require('otp-generator')
const sendMail = require('./mailer')
const { raw } = require('express')
const bcryptSalt = process.env.BCRYPT_SALT;

var functions = {


    authenticatevonisha: function (req, res) {
        if (req.body.email.length >= 4 && req.body.password.length >= 8) {
            VonishaUser.findOne({
                email: req.body.email,
            }, function (err, user) {
                if (err) throw err
                if (!user) {
                    res.json({ success: false, msg: 'Invalid Credentials' })
                }
                else {
                    user.comparePasswords(req.body.password, function (err, isMatch) {
                        if (isMatch && !err) {
                            var token = jwt.encode(user, config.secret)
                            res.json({ success: true, token: token })
                        } else {
                            return res.json({ success: false, msg: 'Invalid Credentials' })
                        }
                    })
                }
            })
        } else {
            return res.json({ success: false, msg: 'Fill all fields' })
        }
    },

    addUser: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedToken = jwt.decode(token, config.secret)
            var newUser = User({
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: "LaA30-=jhh38747@#$%",
                type: req.body.data,
                dob: req.body.dob,
            },);

            var user = {
                name: req.body.firstName,
                email: req.body.email,
            }

            User.findOne({
                email: req.body.email,
            }, function (err, user) {
                if (err) throw err;

                if (!user) {
                    newUser.save(function (err) {
                        if (err) {
                            res.json({ success: false, msg: 'Failed to save ' + err })
                        }
                        else {
                            var token = jwt.encode(user, config.secret)
                            sendMail(req.body.firstName + " " + req.body.lastName, req.body.email, 0, token);
                            res.json({ success: true, msg: 'Succcessfully saved' })
                        }
                    })
                } else {

                    return res.json({ success: false, msg: "User Already Exists" })

                }
            })

        } else {
            return res.json({ success: false, msg: 'No Headders' })
        }

    },

    addVonishaUser: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedToken = jwt.decode(token, config.secret)
            var newUser = VonishaUser({
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: "LaA30-=jhh38747@#$%",
                data: req.body.data,
                number: req.body.number,
                type: req.body.type,
            },);

            var tokenData = {
                name: req.body.firstName,
                email: req.body.email,
            }

            VonishaUser.findOne({
                email: req.body.email,
            }, function (err, user) {
                if (err) throw err;

                if (!user) {
                    newUser.save(function (err) {
                        if (err) {
                            res.json({ success: false, msg: 'Failed to save ' + err })
                        }
                        else {
                            var token = jwt.encode(tokenData, config.secret)
                            sendMail(req.body.firstName + " " + req.body.lastName, req.body.email, 0, token);
                            res.json({ success: true, msg: 'Succcessfully saved' })
                        }
                    })
                } else {

                    return res.json({ success: false, msg: "User Already Exists" })

                }
            })

        } else {
            return res.json({ success: false, msg: 'No Headders' })
        }

    },

    addVonishaStudent: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedToken = jwt.decode(token, config.secret)

            var newUser = Students({
                class: req.body.class,
                data: req.body.data,
            },);

            Students.findOne({
                class: req.body.class,
            }, function (err, user) {
                if (err) throw err;

                if (!user) {
                    newUser.save(function (err) {
                        if (err) {
                            res.json({ success: false, msg: 'Failed to save ' + err })
                        }
                        else {
                            res.json({ success: true, msg: 'Succcessfully saved' })
                        }
                    })
                } else {

                    var data = user.data
                    data.push(req.body.data)

                    Students.updateOne(

                        { class: user.class },
                        { $set: { data: data } },
                        { upsert: false },
                    ).then((obj) => {
                        console.log('Added Student');
                        res.json({ success: true, msg: 'Successfully Updated' })
                    }).catch((err) => {
                        res.json({ success: false, msg: 'Error ' + err })
                    })

                }
            })

        } else {
            return res.json({ success: false, msg: 'No Headders' })
        }

    },

    validateToken: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedToken = jwt.decode(token, config.secret)

            User.findOne({
                email: decodedToken.email,
            }, function (err, user) {
                if (err) throw err;

                if (!user) {
                    res.json({ success: false, msg: 'User not found' })
                } else {
                    return res.json({ success: true, msg: decodedToken.name })
                }
            })
        } else {
            return res.json({ success: false, msg: 'No Headders' })
        }
    },

    validateVonishaToken: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedToken = jwt.decode(token, config.secret)
            console.log(decodedToken)

            VonishaUser.findOne({
                email: decodedToken.email,
            }, function (err, user) {
                if (err) throw err;

                if (!user) {
                    res.json({ success: false, msg: 'User not found' })
                } else {
                    return res.json({ success: true, msg: decodedToken.name })
                }
            })
        } else {
            return res.json({ success: false, msg: 'No Headders' })
        }
    },

    getvonishainfo: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedToken = jwt.decode(token, config.secret)

            VonishaUser.findOne({
                email: decodedToken.email,
            }, function (err, user) {
                if (err) throw err;

                if (!user) {
                    res.json({ success: false, msg: 'User not found' })
                } else {
                    return res.json(
                        {
                            success: true,
                            firstName: decodedToken.firstName,
                            lastName: decodedToken.lastName,
                            email: decodedToken.email,
                            type: user.type,
                            roll_no: user.roll_no,
                            dob: user.dob,
                        })
                }
            })
        } else {
            return res.json({ success: false, msg: 'No Headders' })
        }
    },

    resetPassword: async function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedToken = jwt.decode(token, config.secret)

            var hash = await bcrypt.hash(req.body.p, Number(bcryptSalt))
            User.updateOne(
                { email: decodedToken.email },
                { $set: { password: hash } },
                { upsert: false },
            ).then((obj) => {
                console.log('Updated: Password');
                res.json({ success: true, msg: 'Successfully Updated' })
            }).catch((err) => {
                res.json({ success: false, msg: 'Error ' + err })
            })
        }
    },

    resetVonishaPassword: async function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedToken = jwt.decode(token, config.secret)

            var hash = await bcrypt.hash(req.body.p, Number(bcryptSalt))
            VonishaUser.updateOne(
                { email: decodedToken.email },
                { $set: { password: hash } },
                { upsert: false },
            ).then((obj) => {
                console.log('Updated: Vonisha Password');
                res.json({ success: true, msg: 'Successfully Updated' })
            }).catch((err) => {
                res.json({ success: false, msg: 'Error ' + err })
            })
        }
    },

    matchPasswords: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedToken = jwt.decode(token, config.secret)
            User.findOne({
                email: decodedToken.email,
            }, function (err, user) {
                if (err) throw err;

                user.comparePasswords(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        res.json({ success: true, msg: 'passwords match' })
                    } else {
                        return res.json({ success: false, msg: 'Wrong Password' })
                    }
                })
            })
        }
    },

    forgotPassword: function (req, res) {
        User.findOne({
            email: req.body.email,
        }, function (err, user) {
            if (err) throw err
            if (!user) {
                res.json({ success: false, msg: 'User not found' })
            } else {
                if (user.dob == req.body.dob) {
                    var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: true })

                    User.updateOne(
                        { email: req.body.email },
                        { $set: { otp: otp } },
                        { upsert: true },
                    ).then((obj) => {
                        var currentDate = new Date();
                        var futureDate = new Date(currentDate.getTime() + 900 * 60000);

                        var userDetail = {
                            name: user.firstName,
                            email: req.body.email,
                        }

                        var token = jwt.encode(userDetail, config.secret)
                        sendMail(user.firstName, req.body.email, 1, token)
                        res.json({ success: true, msg: "Sent Mail" })

                    }).catch((err) => {
                        res.json({ success: false, msg: 'Error ' + err })
                    })
                } else {
                    res.json({ success: false, msg: 'Invalid Credentials' })
                }
            }
        })
    },


    addVenue: function (req, res) {

        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedToken = jwt.decode(token, config.secret)

            User.findOne({
                email: decodedToken.email,
            }, function (err, user) {
                if (err) throw err;

                if (!user) {
                    res.json({ success: false, msg: 'User not found' })
                } else {
                    var id = otpGenerator.generate(8, { upperCase: true, specialChars: true, alphabets: true })
                    var newVenue = Venue({
                        name: req.body.name,
                        capacity: req.body.capacity,
                        type: req.body.type,
                        id: id,
                    },);

                    newVenue.save(function (err) {
                        if (err) {
                            res.json({ success: false, msg: 'Failed to save ' + err })
                        }
                        else {
                            res.json({ success: true, msg: 'Succcessfully saved' })
                            console.log("saved")
                        }
                    })
                }
            })
        } else {
            return res.json({ success: false, msg: 'No Headders' })
        }

    },

    addBooking: function (req, res) {

        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedToken = jwt.decode(token, config.secret)

            User.findOne({
                email: decodedToken.email,
            }, function (err, user) {
                if (err) throw err;

                if (!user) {
                    res.json({ success: false, msg: 'User not found' })
                } else {
                    var id = otpGenerator.generate(8, { upperCase: true, specialChars: true, alphabets: true })
                    var decodedData = JSON.parse(req.body.data)

                    var newBooking = BookingDetails({
                        id: id,
                        user: user.firstName,
                        repeat: decodedData["repeat"],
                        data: req.body.data,
                    },);

                    newBooking.save(function (err) {
                        if (err) {
                            res.json({ success: false, msg: 'Failed to save ' + err })
                        }
                        else {

                            Bookings.findOne({
                                date: decodedData["date"],
                                venue: decodedData["venue"],
                            }, function (err, bookings) {
                                if (err) throw err;

                                if (!bookings) {
                                    var bookingData = [`${decodedData["from"]} ${decodedData["to"]} ${id} ${decodedData["stream"]} ${decodedData["repeat"]}`]

                                    var newBooking = Bookings({
                                        date: decodedData["date"],
                                        venue: decodedData["venue"],
                                        data: bookingData,
                                    },);

                                    newBooking.save(function (err) {
                                        if (err) {
                                            res.json({ success: false, msg: 'Failed to save ' + err })
                                        }
                                        else {
                                            res.json({ success: true, msg: 'Succcessfully saved' })
                                        }
                                    })
                                } else {
                                    var rawdata = bookings.data
                                    var item = `${decodedData["from"]} ${decodedData["to"]} ${id} ${decodedData["stream"]}`;

                                    rawdata.push(`${decodedData["from"]} ${decodedData["to"]} ${id} ${decodedData["stream"]} ${decodedData["repeat"]}`)
                                    rawdata.sort()
                                    if (rawdata.length == 2) {
                                        var endTime = rawdata[0].split(' ')[1]
                                        var startTime = rawdata[1].split(' ')[0]

                                        console.log(endTime)
                                        console.log(startTime)



                                        if (startTime >= endTime) {

                                            Bookings.updateOne(
                                                { date: decodedData["date"], venue: decodedData["venue"] },
                                                { $set: { data: rawdata } },
                                                { upsert: false },
                                            ).then((obj) => {

                                                res.json({ success: true, msg: "Added" })

                                            }).catch((err) => {
                                                res.json({ success: false, msg: 'Error ' + err })
                                            })

                                        } else {
                                            res.json({ success: false, msg: "A booking already exists!!" })


                                        }
                                    } else {
                                        var index = rawdata.indexOf(item);
                                        console.log(index);

                                        if (index == 0) {
                                            var endTime = rawdata[0].split(' ')[1]
                                            var startTime = rawdata[1].split(' ')[0]

                                            console.log(endTime)
                                            console.log(startTime)



                                            if (startTime >= endTime) {

                                                Bookings.updateOne(
                                                    { date: decodedData["date"], venue: decodedData["venue"] },
                                                    { $set: { data: rawdata } },
                                                    { upsert: false },
                                                ).then((obj) => {

                                                    res.json({ success: true, msg: "Added" })

                                                }).catch((err) => {
                                                    res.json({ success: false, msg: 'Error ' + err })
                                                })

                                            } else {
                                                res.json({ success: false, msg: "A booking already exists!!" })
                                            }

                                        } else if (index == rawdata.length - 1) {

                                            var endTime = rawdata[index - 1].split(' ')[1]
                                            var startTime = rawdata[index].split(' ')[0]

                                            console.log(endTime)
                                            console.log(startTime)



                                            if (startTime >= endTime) {

                                                Bookings.updateOne(
                                                    { date: decodedData["date"], venue: decodedData["venue"] },
                                                    { $set: { data: rawdata } },
                                                    { upsert: false },
                                                ).then((obj) => {

                                                    res.json({ success: true, msg: "Added" })

                                                }).catch((err) => {
                                                    res.json({ success: false, msg: 'Error ' + err })
                                                })

                                            } else {
                                                res.json({ success: false, msg: "A booking already exists!!" })
                                            }

                                        } else {

                                            var endTime = rawdata[index - 1].split(' ')[1]
                                            var startTime = rawdata[index].split(' ')[0]
                                            var endTime1 = rawdata[index].split(' ')[1]
                                            var startTime1 = rawdata[index + 1].split(' ')[0]


                                            console.log(endTime)
                                            console.log(startTime)



                                            if (startTime >= endTime && endTime1 <= startTime1) {

                                                Bookings.updateOne(
                                                    { date: decodedData["date"], venue: decodedData["venue"] },
                                                    { $set: { data: rawdata } },
                                                    { upsert: false },
                                                ).then((obj) => {

                                                    res.json({ success: true, msg: "Added" })

                                                }).catch((err) => {
                                                    res.json({ success: false, msg: 'Error ' + err })
                                                })

                                            } else {
                                                res.json({ success: false, msg: "A booking already exists!!" })
                                            }

                                        }
                                    }



                                }
                            })

                        }
                    })
                }
            })
        } else {
            return res.json({ success: false, msg: 'No Headders' })
        }

    },

    getVenueNames: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedToken = jwt.decode(token, config.secret)

            User.findOne({
                email: decodedToken.email,
            }, function (err, user) {
                if (err) throw err;

                if (!user) {
                    res.json({ success: false, msg: 'User not found' })
                } else {
                    Venue.find(function (err, venue) {
                        var data = [];
                        var index = 0;
                        while (index < venue.length) {
                            data.push({
                                "name": venue[index].name,
                                "capacity": venue[index].capacity,
                                "type": venue[index].type,
                            },)
                            ++index
                        }
                        return res.json({ success: true, data: data })
                    })
                }
            })
        } else {
            return res.json({ success: false, msg: 'No Headders' })
        }
    },

    getBookings: async function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedToken = jwt.decode(token, config.secret)

            User.findOne({
                email: decodedToken.email,
            }, function (err, user) {
                if (err) throw err;

                if (!user) {
                    res.json({ success: false, msg: 'User not found' })
                } else {
                    dates = req.body.dates;
                    var datails = [];
                    var index = 0;

                    schloop();
                    function schloop() {
                        if (index <= dates.length - 1) {
                            Bookings.find({
                                date: dates[index],
                            }, function (err, booking) {
                                if (err) throw err
                                if (booking.length == 0) {
                                    datails[index] = 'null';
                                    ++index;
                                    schloop();
                                } else {
                                    var meetIndex = 0;
                                    var meets = [];
                                    loop();
                                    function loop() {
                                        if (meetIndex <= booking.length - 1) {
                                            meets[meetIndex] = {
                                                venue: booking[meetIndex]["venue"],
                                                data: booking[meetIndex]["data"],
                                            }
                                            ++meetIndex;
                                            loop();
                                        } else {
                                            datails[index] = meets;
                                            ++index;
                                            schloop();
                                        }
                                    }
                                }
                            })
                        } else {
                            return res.json({ success: true, data: datails })
                        }
                    }

                }
            })
        } else {
            return res.json({ success: false, msg: 'No Headders' })
        }
    },

    getVenueDetails: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedToken = jwt.decode(token, config.secret)

            BookingDetails.findOne({
                id: req.headers.authorization.split(' ')[2],
            }, function (err, details) {
                if (err) throw err;

                if (!details) {
                    res.json({ success: false, msg: 'User not found' })
                } else {

                    var data = {
                        "data": details.data,
                        "user": details.user,
                    }

                    return res.json({ success: true, data: data })
                }
            })
        } else {
            return res.json({ success: false, msg: 'No Headders' })
        }
    },

    deleteBooking: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedToken = jwt.decode(token, config.secret)

            BookingDetails.findOneAndRemove({
                id: req.headers.authorization.split(' ')[2],
            }, function (err, details) {
                if (err) throw err;

                if (!details) {
                    res.json({ success: false, msg: 'Does Not Exist' })
                } else {
                    var decodedData = JSON.parse(details.data[0])

                    Bookings.findOne({
                        date: decodedData["date"],
                        venue: decodedData["venue"],
                    }, function (err, bookings) {
                        if (err) throw err;

                        if (!bookings) {
                            res.json({ success: false, msg: 'Does Not Exist' })
                        } else {
                            var rawdata = bookings.data
                            var item = `${decodedData["from"]} ${decodedData["to"]} ${req.headers.authorization.split(' ')[2]} ${decodedData["stream"]} ${decodedData["repeat"]}`;

                            if (rawdata.length == 1) {

                                Bookings.deleteOne({
                                    date: decodedData["date"],
                                    venue: decodedData["venue"],
                                }, function (err) {
                                    if (err) throw err;

                                    else return (res.json({ success: true, msg: "Successfully Deleted" }))
                                })

                            } else {
                                rawdata.remove(item)

                                Bookings.updateOne(
                                    { date: decodedData["date"], venue: decodedData["venue"] },
                                    { $set: { data: rawdata } },
                                    { upsert: false },
                                ).then((obj) => {

                                    res.json({ success: true, msg: "Successfully Deleted" })

                                }).catch((err) => {
                                    res.json({ success: false, msg: 'Error ' + err })
                                })
                            }
                        }
                    })
                }
            })
        } else {
            return res.json({ success: false, msg: 'No Headders' })
        }
    },

    getUserNames: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedToken = jwt.decode(token, config.secret)

            User.findOne({
                email: decodedToken.email,
            }, function (err, user) {
                if (err) throw err;

                if (!user) {
                    res.json({ success: false, msg: 'User not found' })
                } else {
                    User.find(function (err, user) {
                        var data = [];
                        var index = 2;
                        while (index < user.length) {
                            data.push({
                                "name": user[index].firstName + " " + user[index].lastName,
                                "email": user[index].email,
                                "type": user[index].type,
                            },)
                            ++index
                        }
                        return res.json({ success: true, data: data })
                    })
                }
            })
        } else {
            return res.json({ success: false, msg: 'No Headders' })
        }
    },

    getVonishaUserNames: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedToken = jwt.decode(token, config.secret)

            VonishaUser.findOne({
                email: decodedToken.email,
            }, function (err, user) {
                if (err) throw err;

                if (!user) {
                    res.json({ success: false, msg: 'User not found' })
                } else {
                    VonishaUser.find(function (err, user) {
                        var data = [];
                        var index = 2;
                        while (index < user.length) {
                            var userData = user[index].data[0]
                            var dataPush = {
                                "role": userData["role"],
                            }
                            data.push({
                                "name": user[index].firstName + " " + user[index].lastName,
                                "email": user[index].email,
                                "number": user[index].number,
                                "data": userData,
                            },)
                            ++index
                        }
                        return res.json({ success: true, data: data })
                    })
                }
            })
        } else {
            return res.json({ success: false, msg: 'No Headders' })
        }
    },
    getVonishaUserNames: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedToken = jwt.decode(token, config.secret)

            VonishaUser.findOne({
                email: decodedToken.email,
            }, function (err, user) {
                if (err) throw err;

                if (!user) {
                    res.json({ success: false, msg: 'User not found' })
                } else {
                    VonishaUser.find(function (err, user) {
                        var data = [];
                        var index = 2;
                        while (index < user.length) {
                            var userData = user[index].data[0]
                            var dataPush = {
                                "role": userData["role"],
                            }
                            data.push({
                                "name": user[index].firstName + " " + user[index].lastName,
                                "email": user[index].email,
                                "number": user[index].number,
                                "data": userData,
                            },)
                            ++index
                        }
                        return res.json({ success: true, data: data })
                    })
                }
            })
        } else {
            return res.json({ success: false, msg: 'No Headders' })
        }
    },
    getVonishaUserNames: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedToken = jwt.decode(token, config.secret)

            VonishaUser.findOne({
                email: decodedToken.email,
            }, function (err, user) {
                if (err) throw err;

                if (!user) {
                    res.json({ success: false, msg: 'User not found' })
                } else {
                    VonishaUser.find(function (err, user) {
                        var data = [];
                        var index = 2;
                        while (index < user.length) {
                            var userData = user[index].data[0]
                            var dataPush = {
                                "role": userData["role"],
                            }
                            data.push({
                                "name": user[index].firstName + " " + user[index].lastName,
                                "email": user[index].email,
                                "number": user[index].number,
                                "data": userData,
                            },)
                            ++index
                        }
                        return res.json({ success: true, data: data })
                    })
                }
            })
        } else {
            return res.json({ success: false, msg: 'No Headders' })
        }
    },
    getVonishaStudentNames: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedToken = jwt.decode(token, config.secret)

            VonishaUser.findOne({
                email: decodedToken.email,
            }, function (err, user) {
                if (err) throw err;

                if (!user) {
                    res.json({ success: false, msg: 'User not found' })
                } else {
                    Students.findOne({
                        class: req.body.class,
                    }, function (err, user) {
                        if (!user) {
                            return res.json({ success: true, data: [] })

                        } else {
                            var data = user.data;
                            return res.json({ success: true, data: data })
                        }

                    })
                }
            })
        } else {
            return res.json({ success: false, msg: 'No Headders' })
        }
    },


}


module.exports = functions