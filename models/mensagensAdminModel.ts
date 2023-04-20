import mongoose, {Schema} from 'mongoose';

const mensagensAdminSchema = new Schema ({
    idUsuarioDoador: {type: String, required: true },
    titulo: {type: String, required: true },
    mensagem: {type: String, required: true },
    dataMensagemAdmin: {type: Date, required: true }
});

export const mensagensAdminModel = (mongoose.models.mensagensAdmin || mongoose.model('mensagensAdmin', mensagensAdminSchema));