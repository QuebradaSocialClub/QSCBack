import { NextApiRequest, NextApiResponse } from 'next';
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg"
import { upload, uploadImagemCosmic } from "../../services/uploadImagemCosmic"
import nc from 'next-connect';
import { conexaoMongoDB } from '@/middlewares/conexaoMongoDB';
import { validacaoJWT } from '@/middlewares/validacaoJWT';
import { doacoesModel } from '@/models/doacoesModel';
import { usuariosModel } from '@/models/usuariosModel';
import { doacoesRequest } from '@/types/doacoesRequest';

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

        try {
            const { userId } = req.query;

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

        }   catch (e: any) {
            console.log(e);
            return res.status(400).json({ erro: "Não foi possível disponibilizar sua doação: " + e.toString() });
        }
    })
    .get(async (req: NextApiRequest, res: NextApiResponse) => {
        const doacoes = await doacoesModel.find();

        return res.status(200).json({ data: doacoes });
    })


export const config = {
    api: {
        bodyParser: false
    }
}

export default validacaoJWT(conexaoMongoDB(handler));