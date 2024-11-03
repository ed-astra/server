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
// POST /signin vonisha
router.post('/signinvonisha', actions.authenticatevonisha)

router.post('/addUser', actions.addUser)

router.post('/addvonishastudent', actions.addVonishaStudent)



// get user info
// GET /getinfo
router.get('/getinfo', actions.getvonishainfo)

// token validation
// GET /validatetoken
router.get('/validatetoken', actions.validateToken)

// vonisha token validation
// GET /validatevonishatoken
router.get('/validatevonishatoken', actions.validateVonishaToken)

// compare current passwords
// POST /verifypassword
router.post('/verifypassword', actions.matchPasswords)

// reset user password
// POST /
router.post('/resetpassword', actions.resetPassword)

// reset user password
// POST /
router.post('/resetvonishapassword', actions.resetVonishaPassword)

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

router.post('/getvonishastudents', actions.getVonishaStudentNames)

router.get('/getstaffattendance', actions.getVonishaAttendance)

router.post('/addvonishaenquiry', actions.addEnquiries)

router.get('/getvonishaenquiry', actions.getVonishaEnquiries)

router.post('/updatestaffattendance', actions.updateVonishaAttendance)

router.post('/updatevonishaCalender', actions.updateVonishaCalender)

router.get('/getvonishacalender', actions.getVonishaCalender)







module.exports = router