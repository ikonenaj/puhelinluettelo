const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const Person = require('./models/person');

morgan.token('post', (request, response) => {
    if (request.method === "POST") {
        return JSON.stringify(request.body)
    }
})

const errorHandler = (error, request, response ,next) => {
    console.log(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }

    next(error);
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

app.use(cors());
app.use(express.static('build'))
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'));

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"

    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
  ];

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(result => {
        response.json(result);
    })
    .catch(error => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(result => {
        if (result) {
            response.json(result);
        } else {
            response.status(404).end();
        }
    })
    .catch(error => next(error));
});

app.get('/info', async (request, response) => {
    const date = new Date();
    const persons = await Person.find({}).then(result => result);

    response.send(`Phonebook has info for ${persons.length} people <br /><br />${date}`);
});

app.post('/api/persons', async (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        });
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        });
    }

    const exists = await Person.findOne({ name: body.name }).then(result => result);

    if (exists) {
        return response.status(400).json({
            error: 'name must be unique'
        });
    }

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save().then(savedPerson => {
        response.json(savedPerson);
    });
});

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number
    };

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson);
        })
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end();
    })
    .catch(error => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

