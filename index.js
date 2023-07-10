require('dotenv').config({path:'.env'})
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
  
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.get('/info', (request, response) => {
  const datetime = new Date()

  return (
    response.send(`<p> Phonebook has info for ${persons.length} people</p><p>${datetime}</p>`)
  )
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log('id', id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const newId = Math.floor(Math.random() * 10000)

  return newId
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log("Body", body)

/*   if (body.content === undefined) {
    return response.status(400).json({error: 'Content missing'})
  } else if (!body.name) {
    return response.status(400).json({
      error: 'Name missing'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'Number missing'
    })
  } else {
    console.log('3')
     existing_persons = persons.filter(person => {
      return person.name === body.name
    })
    console.log('4')
    console.log("Existing", existing_persons)

    if (existing_persons.length > 0) {
      return response.status(400).json({
        error: 'Name already exists'
      })
    }
  } */ 

  const person = new Person ({
    id: generateId(),
    name: body.name,
    number: body.number
  })

  console.log('Person', person)

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})