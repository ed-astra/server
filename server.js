const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const connectDB = require('./config/db')
const bodyParser = require('body-parser')
const passport = require('passport')
const routes = require('./routes/index')
const router = require('./routes/index')


connectDB()

const app = express();

if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(router)
app.use(passport.initialize)

require('./config/passport')(passport)



const PORT = process.env.port || 3000

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on ${PORT}`)
})

 
