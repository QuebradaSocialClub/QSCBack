import { NextApiRequest, NextApiResponse} from 'next';
import { mensagensAdminModel } from '../../models/mensagensAdminModel'
import { RespostaPadraoMsg } from '@/types/RespostaPadraoMsg';
import { mensagensAdminRequest } from '@/types/mensagensAdminRequest';
import nc from 'next-connect';
import { usuariosModel } from '@/models/usuariosModel';
import { validacaoJWT } from '@/middlewares/validacaoJWT';
import { conexaoMongoDB } from '@/middlewares/conexaoMongoDB';
import { politicaCors } from '@/middlewares/politicaCors';

const handler = nc()
.post(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) =>{

    try { 
        const mensagemRecebida = req.body as mensagensAdminRequest;
    const { userId } = req.query;

    const usuario = await usuariosModel.findById(userId);
            if (!usuario) {
                return res.status(400).json({ erro: "Usuário não informado. " })
            }

            if(!mensagemRecebida.titulo ||
                 mensagemRecebida.titulo.length < 3 ||
                 mensagemRecebida.titulo === ""){
                    return res.status(400).json({erro: "Informe um título válido."})

            }

            if(!mensagemRecebida.mensagem ||
                 mensagemRecebida.mensagem.length < 10 ||
                 mensagemRecebida.mensagem === ""){
                    return res.status(400).json({erro: "Informe uma mensagem válida."})
            }

            const mensagemASerSalva = {
                idUsuarioDoador: userId,
                titulo: mensagemRecebida.titulo,
                mensagem: mensagemRecebida.mensagem,
                dataMensagemAdmin: new Date()
            }
            await mensagensAdminModel.create(mensagemASerSalva);
            return res.status(201).json({ msg: 'Mensagem enviada com sucesso.' });
        } catch(e: any){
            console.log(e);
            return res.status(500).json({ erro: "Não foi possível enviar a mensagem: " + e.toString() });
        }
})
.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const mensagensRecebidas = await mensagensAdminModel.find();

    return res.status(200).json({ data: mensagensRecebidas });
})

export default politicaCors(validacaoJWT(conexaoMongoDB(handler)));