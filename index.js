const express = require('express')
const app = express()
const logger = require('./loggerMiddleware')

app.use(express.json())

app.use(logger)

let notes = [
    {
        id: 1,
        content: 'HTML is easy',
        important: true
    },
    {
        id: 2,
        content: 'Browser can execute only JavaScript',
        important: false
    },
    {
        id: 3,
        content: 'GET and POST are the most important methods of HTTP protocol',
        important: true
    }
]

app.get('/', (req, res) => {
    res.send('<h1>hola mundo</h1>')
})

app.get('/api/notes', (req, res) => {
    res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    const note = notes.find(note => note.id === id)

    if (note) {
        res.send(note)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)

    notes = notes.filter(note => note.id !== id)
    res.status(204).end()
})

app.post('/api/notes', (req, res) => {
    const note = req.body
    console.log(note)

    if (!note || !note.content) {
        return res.status(400).json({ error: 'note.content is missing' })
    }

    const ids = notes.map(note => note.id)
    const maxId = Math.max(...ids)


    const newNote = {
        id: maxId + 1,
        content: note.content,
        important: typeof note.important !== 'undefined' ? note.important : false
    }

    notes = [...notes, newNote]

    res.status(201).json(newNote)
})

app.use((req, res) => {
    res.status(404).json({ error: 'not found' })
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})