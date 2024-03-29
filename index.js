require('dotenv').config({ path:'.env' })
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      return response.json(person)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  const datetime = new Date()

  Person.find({})
    .then(persons => {
      return response.send(`<p> Phonebook has info for ${persons.length} people</p><p>${datetime}</p>`)
    })
})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(response => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => {
  const newId = Math.floor(Math.random() * 10000)

  return newId
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person ({
    id: generateId(),
    name: body.name,
    number: body.number
  })

  console.log('Person', person)

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) =>  {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Incorrect id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})