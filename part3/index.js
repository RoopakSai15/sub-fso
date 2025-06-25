require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')


const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :post')
)

morgan.token('post', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ' '
})



app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if(person){
      response.json(person)
    }else{
      response.status(404).end()
    }
  }).catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const { name,number } = request.body

  if (!name || !number) {
    response.status(400).json({ error:'name or number missing' })
  }

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  console.log(request.params.id)
  Person.findByIdAndDelete(request.params.id)
    .then(
      response.status(204).end()
    )
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  const person = { name, number }

  Person.findById(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query'
  }).then(updatedPerson => {
    if (!updatedPerson){
      return response.status(404).end()
    }

    response.json(updatedPerson)

  }).catch(error => next(error))
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`
  )})
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {

  console.error(error.message)

  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformatted id' })

  }else if (error.name === 'ValidationError'){
    response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})