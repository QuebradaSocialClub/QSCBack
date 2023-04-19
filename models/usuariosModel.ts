import mongoose, {Schema} from 'mongoose';

const usuariosSchema = new Schema ({
    email: {type: String, required: true },
    senha: {type: String, required: true},
    nome: {type: String, required: true},
    endereco: {type: String, required: true},
    nascimento: {type: Date, required: false},
    celular: {type: Number, required: false},
    avatar: {type: String, required: false}
});

export const usuariosModel = (mongoose.models.usuario || mongoose.model('usuario', usuariosSchema));

