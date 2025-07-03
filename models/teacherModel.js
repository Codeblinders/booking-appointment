import mongoose from "mongoose"

const teacherSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    speciality:{
        type: String,
        default: ''
    }
},{
    timestamps: true
})

const Teacher = mongoose.model('teachers',teacherSchema)

export default Teacher;