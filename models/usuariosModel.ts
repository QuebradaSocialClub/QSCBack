import mongoose, {Schema} from 'mongoose';

const usuariosSchema = new Schema ({
    email: {type: String, required: true },
    senha: {type: String, required: true},
    nome: {type: String, required: true},
    endereco: {type: String, required: true},
    nascimento: {type: Date, required: true},
    celular: {type: Number, required: true},
    avatar: {type: String, required: false}
});

export const usuariosModel = (mongoose.models.usuario || mongoose.model('usuario', usuariosSchema));

