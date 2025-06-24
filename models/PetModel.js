import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const petSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },  
    type: { 
        type: String,
        enum: ['perro', 'gato', 'conejo', 'otro'],
        required: true 
    },  
    age: { 
        value: { type: Number, required: true },
        unit: { type: String, enum: ['días', 'meses', 'años'], required: true } 
    },  
    sex: { 
        type: String, 
        enum: ['macho', 'hembra'], 
        required: true 
    },  
    description: { 
        type: String, 
        required: true 
    },
    images: [
        { type: String }
    ],
    status: {
        type: String,
        enum: ['disponible', 'adoptado'],
        default: 'disponible'
    },
    // Cuidador - solo uno será usado
    caretakerPersonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person'
    },
    caretakerRefugeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Refuge'
    },
    adopterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person'
    }
    

});

const Pet = mongoose.model('pets', petSchema);

export default Pet;