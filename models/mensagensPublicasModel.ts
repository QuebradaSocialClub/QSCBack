import mongoose, {Schema} from 'mongoose';

const mensagensPublicasSchema = new Schema ({
    idUsuarioDoador: {type: String, required: true },
    titulo: {type: String, required: true },
    mensagem: {type: String, required: true },
    urlMidia: {type: String, required: false },
    dataMensagemPublica: {type: Date, required: true }
});

export const mensagensPublicasModel = (mongoose.models.mensagensPublicas || mongoose.model('mensagensPublicas', mensagensPublicasSchema));