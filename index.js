const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(morgan('tiny'));

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
    res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        res.json(person)
    } else {
        res.status(400).end()
    }
});

app.get('/info', (req, res) => {
    const date = new Date();
    res.send(`Phonebook has info for ${persons.length} people <br /><br />${date}`);
});

const genereateId = () => {
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

    let id = genereateId();

    while (persons.map(person => person.id).includes(id)) {
        id = genereateId();
    }

    const person = {
        id: genereateId(),
        name: body.name,
        number: body.number
    };

    persons = persons.concat(person);

    res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);

    res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

