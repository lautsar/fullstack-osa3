require('dotenv').config()//{path: './.env'})
const mongoose = require('mongoose')

const url = process.env.MONGO
mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(result => {
    console.log('Connected to DB', result)
  })
  .catch((error) => {
    console.log('Connection error', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)