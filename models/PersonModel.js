import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    canAdopt: {
        type: Boolean,
        default: true
    },
    canCaretake: {
        type: Boolean,
        default: false
    }
});

const Person = mongoose.model('persons', userSchema);

export default Person;