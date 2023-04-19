import mongoose, {Schema} from 'mongoose';

const doacoesSchema = new Schema ({
    idUsuarioDoador: {type: String, required: true },
    produto: {type: String, required: true },
    descricao: {type: String, required: true },
    quantidade: {type: Number, required: false },
    tipo: {type: String, required: false },
    dataDoacao: {type: Date, required: true }
});

export const doacoesModel = (mongoose.models.doacoes || mongoose.model('doacoes', doacoesSchema));