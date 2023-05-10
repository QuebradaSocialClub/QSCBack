import { NextApiRequest, NextApiResponse } from 'next';
import { RespostaPadraoMsg } from '@/types/RespostaPadraoMsg';
import nc from 'next-connect';
import { usuariosModel } from '@/models/usuariosModel';
import { validacaoJWT } from '@/middlewares/validacaoJWT';
import { conexaoMongoDB } from '@/middlewares/conexaoMongoDB';
import { mensagensPrivadoModel } from '@/models/mensagensPrivadoModel';
import { mensagensPrivadoRequest } from '@/types/mensagensPrivadoRequest';
import { politicaCors } from '@/middlewares/politicaCors';

const handler = nc()
    .post(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

        try {
            const mensagemRecebida = req.body as mensagensPrivadoRequest;
            const { userId } = req.query;

            const usuario = await usuariosModel.findById(userId);
            const usuarioRecebedor = await usuariosModel.findById(mensagemRecebida.idUsuarioRecebedor);
            if (!usuario) {
                return res.status(400).json({ erro: "Usuário não informado. " })
            }
            if (!usuarioRecebedor) {
                return res.status(400).json({ erro: "Usuário recebedor não informado. " })
            }

            if (!mensagemRecebida.mensagem ||
                mensagemRecebida.mensagem.length < 10 ||
                mensagemRecebida.mensagem === "") {
                return res.status(400).json({ erro: "Informe uma mensagem válida." })
            }

            const mensagemASerSalva = {
                idUsuarioDoador: userId,
                idUsuarioRecebedor: mensagemRecebida.idUsuarioRecebedor,
                mensagem: mensagemRecebida.mensagem,
                dataMensagemPrivado: new Date()
            }
            await mensagensPrivadoModel.create(mensagemASerSalva);
            return res.status(201).json({ msg: 'Mensagem enviada com sucesso.' });
        } catch (e: any) {
            console.log(e);
            return res.status(500).json({ erro: "Não foi possível enviar a mensagem: " + e.toString() });
        }
    })
    .get(async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            const { userId } = req.query;
            const usuario = await mensagensPrivadoModel.find({ idUsuarioDoador: userId });
            console.log('usuario', usuario);
            return res.status(200).json(usuario);
        } catch (e) {
            console.log(e);
        }
        return res.status(400).json({ erro: 'Nao foi possivel localizar essa mensagem' })
    })

export default politicaCors(validacaoJWT(conexaoMongoDB(handler)));