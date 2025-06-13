import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    name: {
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
    }
});

const Refuge = mongoose.model('refuges', userSchema);

export default Refuge;