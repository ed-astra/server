const express = require('express')
const actions = require('../methods/actions')
const router = express.Router()
const path = require('path');

router.get('/', (req, res) => {
  res.send('Server is Live');
})
router.get('/favicon', (req, res) => {
  res.status(200);
})

router.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

// @ Authenticate user
// POST /signin
router.post('/signin', actions.authenticate)

router.post('/addUser', actions.addUser)


// get user info
// GET /getinfo
router.get('/getinfo', actions.getinfo)

// token validation
// GET /validatetoken
router.get('/validatetoken', actions.validateToken)

// compare current passwords
// POST /verifypassword
router.post('/verifypassword', actions.matchPasswords)

// reset user password
// POST /
router.post('/resetpassword', actions.resetPassword)

router.post('/adduser', actions.addUser)


// add vonisha password
// POST /addvonishauser
router.post('/addvonishauser', actions.addVonishaUser)

router.post('/addvenue', actions.addVenue)

router.post('/addbooking', actions.addBooking)

router.post('/forgotpassword', actions.forgotPassword)

router.get('/getvenuenames', actions.getVenueNames)

router.post('/getbookings', actions.getBookings)

router.get('/getbookingdetails', actions.getVenueDetails)

router.get('/deletebooking', actions.deleteBooking)

router.get('/getuserdetails', actions.getUserNames)

router.get('/getvonishauserdetails', actions.getVonishaUserNames)



module.exports = router