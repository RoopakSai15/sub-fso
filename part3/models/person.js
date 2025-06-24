const mongoose = require("mongoose");

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

console.log("connecting to", url)
mongoose.connect(url)
    .then(result => {
        console.log("connected to MongoDB")
    })
    .catch(error => {
        console.log("error connecting to MongoDB",error.message)
    })

const validNumber = (phoneNumber) => {
    var pattern = /^\d{2,3}-\d+$/
    return pattern.test(phoneNumber)
}

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, "Name too short!"],
        required: true
    },
    number: {
        type: String,
        minlength: [8, "Number too short"],
        validate: [validNumber, "Number is not valid"],
        required: true
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
