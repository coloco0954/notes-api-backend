require('dotenv').config()

require('./mongo')

const express = require('express')
const app = express()
const logger = require('./middleware/loggerMiddleware')
const notFound = require('./middleware/notFound')
const handdleErrors = require('./middleware/handdleErrors')
const cors = require('cors')

const Note = require('./models/Note')

app.use(express.json())

app.use(cors())

app.use(logger)

let notes = []

app.get('/', (req, res) => {
    res.send('<h1>hola mundo</h1>')
})

app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes)
    })
})

app.get('/api/notes/:id', (req, res, next) => {
    const { id } = req.params

    Note.findById(id).then(note => {
        if (note) {
            return res.json(note)
        } else {
            res.status(404).end()
        }
    }).catch(error => {
        next(error)
    })
})

app.put('/api/notes/:id', (req, res, next) => {
    const { id } = req.params

    const note = req.body

    const newNoteInfo = {
        content: note.content,
        important: note.important
    }

    Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
        .then(result => {
            res.json(result)
        })
        .catch(error => {
            next(error)
        })
})

app.delete('/api/notes/:id', (req, res, next) => {
    const { id } = req.params

    Note.findByIdAndDelete(id).then(result => {
        res.status(204).end()
    }).catch(error => {
        next(error)
    })
})

app.post('/api/notes', (req, res) => {
    const note = req.body

    if (!note || !note.content) {
        return res.status(400).json({ error: 'note.content is missing' })
    }

    const newNote = new Note({
        content: note.content,
        important: typeof note.important !== 'undefined' ? note.important : false
    })

    newNote.save().then(saveNewNote => {
        res.status(201).json(saveNewNote)
    })
})

app.use(notFound)

app.use(handdleErrors)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})