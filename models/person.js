require('dotenv').config()//{path: './.env'})
const mongoose = require('mongoose')
const password = process.env.PASSWORD

const url = process.env.MONGO
mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(result => {
        console.log('Connected to DB')
    })
    .catch((error) => {
        console.log('Connection error')
    })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)