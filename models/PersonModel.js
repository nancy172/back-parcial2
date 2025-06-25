import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const personSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'users' 
    },
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
    canAdopt: {
        type: Boolean,
        default: true
    },
    canGiveForAdoption: {
        type: Boolean,
        default: false
    }
});

const Person = mongoose.model('persons', personSchema);

export default Person;