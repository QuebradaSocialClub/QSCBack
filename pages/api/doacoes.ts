import { NextApiRequest, NextApiResponse } from 'next';
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg"
import { upload, uploadImagemCosmic } from "../../services/uploadImagemCosmic"
import nc from 'next-connect';
import { conexaoMongoDB } from '@/middlewares/conexaoMongoDB';
import { validacaoJWT } from '@/middlewares/validacaoJWT';
import { doacoesModel } from '@/models/doacoesModel';
import { usuariosModel } from '@/models/usuariosModel';
import { doacoesRequest } from '@/types/doacoesRequest';
import { politicaCors } from '@/middlewares/politicaCors';

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

        try {
            const { userId } = req.query;
            const { doacaoId } = req.query;

            const doacoes = req.body as doacoesRequest;

            const usuario = await usuariosModel.findById(userId);

            if (!usuario) {
                return res.status(400).json({ erro: "Usuário não informado. " })
            }


            if (!req || !req.body) {
                return res.status(400).json({ erro: "Insira as informações necessárias para disponibilizar sua doação." });
            }

            if (!doacoes.produto || doacoes.produto.length < 3) {
                return res.status(400).json({ erro: "Informe o nome de um produto válido para realizar a doação." });
            }
            if (!doacoes.descricao || doacoes.descricao.length < 10) {
                return res.status(400).json({
                    erro: "Informe na descrição detalhes da doação, como: se o alimento está cozido, temperado" +
                        " ou crú. Informe qual melhor horário e local para retirada da doação."
                })
            }


            const doacao = {
                idUsuarioDoador: usuario._id,
                produto: doacoes.produto,
                descricao: doacoes.descricao,
                quantidade: doacoes.quantidade,
                tipo: doacoes.tipo,
                dataDoacao: new Date()
            }
            await doacoesModel.create(doacao);
            return res.status(200).json({ msg: "Doação cadastrada com sucesso. Agradecemos pela sua atitude solidária!" });

        } catch (e: any) {
            console.log(e);
            return res.status(400).json({ erro: "Não foi possível disponibilizar sua doação: " + e.toString() });
        }
    })
    .get(async (req: NextApiRequest, res: NextApiResponse) => {    
        try {
    
            const { idDoacao, userId } = req.query;
    
            const usuarioEncontrado = await usuariosModel.findById(userId);
    
            if (!usuarioEncontrado || usuarioEncontrado.length === 0) {
                return res.status(404).json({ msg: "Usuário não encontrado" });
            }
    
            const doacaoEncontrada = await doacoesModel.findById(idDoacao);
    
            if (!doacaoEncontrada || doacaoEncontrada.length === 0) {
                return res.status(404).json({ msg: "Doação não encontrada" });
            }
    
            usuarioEncontrado.senha = null;
    
            const doacaoResponse = {
                doacao: doacaoEncontrada,
                nomeQuemDoou: usuarioEncontrado.nome
            }
    
            return res.status(200).json({ data: doacaoResponse});
    
        } catch (error) {
            return res.status(500).json({ msg: "Ocorreu um erro ao buscar a doação." });
        }
      })

//se não enviamos arquivo de mídia não precisamos passar pelo form-data, por isso comentamos para poder enviar+
//as informaçoes pelo json no postman. Caso queira passar pelo form-data é só descomentar o trecho abaixo:

/*export const config = {
    api: {
        bodyParser: false
    }
}*/

export default politicaCors(validacaoJWT(conexaoMongoDB(handler)));