const { model, Schema } = require('mongoose')

const notesSchema = new Schema({
    content: String,
    important: Boolean
})

notesSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Note = model('Note', notesSchema)

// const note = new Note({
//     content: 'MongoDB es increible',
//     important: true
// })

// note.save()
//     .then(result => {
//         console.log(result)
//         mongoose.connection.close()
//     })
//     .catch(error => {
//         console.error(error)
//     })

// Note.find().then(result => {
//     console.log(result)
//     mongoose.connection.close()
// })

module.exports = Note