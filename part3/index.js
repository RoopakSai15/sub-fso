const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :post')
)

morgan.token('post', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ' '
})

app.use(express.static('dist'))
app.use(cors())

const persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    
    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`
    )
})

app.post('/api/persons', (request, response) => {
    const {name,number} = request.body

    if (!name || !number) {
        response.status(400).json({error:'name or number missing'})
    }

    const nameExists = persons.some(person => person.name === name)

    if (nameExists) {
        response.status(400).json({error:'name must be unique'})
    }

    const newPerson = {
        id: Math.floor(Math.random()*10000000).toString(),
        name,
        number
    }

    persons.push(newPerson)
    response.status(200).json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const index = persons.findIndex(person => person.id === id)

    if (index !== -1){
        persons.splice(index, 1)
        response.status(204).end()
    } else {
        response.status(404).end()
    }

})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})