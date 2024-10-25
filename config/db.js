const mongoose = require('mongoose')
const dbConfig = require('./dbConfig')

const connectDB = async() => {
    try{
        const conn = await mongoose.connect(dbConfig.database)
        console.log(`connected to database: ${conn.connection.host}`)

    }
    catch(err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB