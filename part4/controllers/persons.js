const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }).catch(error => next(error))
})

personsRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if(person){
      response.json(person)
    }else{
      response.status(404).end()
    }
  }).catch(error => next(error))
})


personsRouter.post('/', (request, response, next) => {
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

personsRouter.delete('/:id', (request, response, next) => {
  console.log(request.params.id)
  Person.findByIdAndDelete(request.params.id)
    .then(
      response.status(204).end()
    )
    .catch(error => next(error))

})

personsRouter.put('/:id', (request, response, next) => {
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

personsRouter.get('/info', (request, response) => {
  Person.find({}).then(persons => {response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`
  )})
})

module.exports = personsRouter