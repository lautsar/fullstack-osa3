const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(cors())

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "12345"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "23456"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "34567"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "45678"
  }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (req, res) => {
    console.log('kutsutaan get')
    res.json(persons)
  })

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const datetime = new Date()

  return (
    response.send(`<p> Phonebook has info for ${persons.length} people</p><p>${datetime}</p>`)
  )
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const newId = Math.floor(Math.random() * 10000)

  return newId
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'Name missing'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'Number missing'
    })
  } else {
    existing_persons = persons.filter(person => {
      console.log("Person.name", person.name)
      console.log("Person", body.name)
      return person.name === body.name
    })
    console.log(existing_persons)

    if (existing_persons.length > 0) {
      return response.status(400).json({
        error: 'Name already exists'
      })
    }
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)