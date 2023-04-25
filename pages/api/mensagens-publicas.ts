import { NextApiRequest, NextApiResponse } from 'next';
import { RespostaPadraoMsg } from '@/types/RespostaPadraoMsg';
import nc from 'next-connect';
import { usuariosModel } from '@/models/usuariosModel';
import { validacaoJWT } from '@/middlewares/validacaoJWT';
import { conexaoMongoDB } from '@/middlewares/conexaoMongoDB';
import { mensagensPublicasModel } from '@/models/mensagensPublicasModel';
import { mensagensPublicasRequest } from '@/types/mensagensPublicasRequest';
import { upload, uploadImagemCosmic } from "../../services/uploadImagemCosmic";

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

        try {
            const mensagemEnviada = req.body as mensagensPublicasRequest;
            const { userId } = req.query;

            const usuario = await usuariosModel.findById(userId);
            if (!usuario) {
                return res.status(400).json({ erro: "Usuário não informado. " })
            }

            if (!mensagemEnviada.titulo ||
                mensagemEnviada.titulo.length < 5 ||
                mensagemEnviada.titulo === "") {
                return res.status(400).json({ erro: "Informe um título válido." })
            }

            if (!mensagemEnviada.mensagem ||
                mensagemEnviada.mensagem.length < 10 ||
                mensagemEnviada.mensagem === "") {
                return res.status(400).json({ erro: "Informe uma mensagem válida." })
            }

            const image = await uploadImagemCosmic(req);

            const mensagemASerEnviada = {
                idUsuarioDoador: userId,
                titulo: mensagemEnviada.titulo,
                mensagem: mensagemEnviada.mensagem,
                urlMidia: image?.media?.url,
                dataMensagemPublica: new Date()
            }
            await mensagensPublicasModel.create(mensagemASerEnviada);
            return res.status(201).json({ msg: 'Mensagem enviada com sucesso.' });
        } catch (e: any) {
            console.log(e);
            return res.status(500).json({ erro: "Não foi possível enviar a mensagem: " + e.toString() });
        }
    })
    .get(async (req: NextApiRequest, res: NextApiResponse) => {
        const mensagensEnviadas = await mensagensPublicasModel.find();

        return res.status(200).json({ data: mensagensEnviadas });
    })

export const config = {
    api: {
        bodyParser: false
    }
}

export default validacaoJWT(conexaoMongoDB(handler));