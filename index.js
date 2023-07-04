require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();
app.use(cors());

morgan.token('post', (req, res) => {
    if (req.method === "POST") {
        return JSON.stringify(req.body)
    }
})

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'));
app.use(express.static('build'))

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

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        res.json(result);
    });
});

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(result => {
        res.json(result);
    });
});

app.get('/info', (req, res) => {
    const date = new Date();
    res.send(`Phonebook has info for ${persons.length} people <br /><br />${date}`);
});

const generateId = () => {
    return Math.floor(Math.random() * 10000);
};

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'
        });
    }

    if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        });
    }

    if (persons.map(person => person.name).includes(body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        });
    }

    /*let id = generateId();

    while (persons.map(person => person.id).includes(id)) {
        id = generateId();
    }*/

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save().then(savedPerson => {
        res.json(savedPerson);
    });

    /*const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    };

    persons = persons.concat(person);

    res.json(person);*/
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);

    res.status(204).end();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

