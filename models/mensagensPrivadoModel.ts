import mongoose, {Schema} from 'mongoose';

const mensagensPrivadoSchema = new Schema ({
    idUsuarioDoador: {type: String, required: true },
    idUsuarioRecebedor: {type: String, required: true },
    mensagem: {type: String, required: true },
    dataMensagemPrivado: {type: Date, required: true }
});

export const mensagensPrivadoModel = (mongoose.models.mensagensPrivado || mongoose.model('mensagensPrivado', mensagensPrivadoSchema));