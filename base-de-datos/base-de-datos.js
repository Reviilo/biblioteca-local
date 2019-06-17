// Import the mongoose module
var mongoose = require('mongoose')

// Set up the default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/my_database'
mongoose.connect (mongoDB, { useNewUrlParser : true })

// Get the default connection
var db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
