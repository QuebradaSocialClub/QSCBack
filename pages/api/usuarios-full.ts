import type { NextApiRequest, NextApiResponse } from 'next';
import { conexaoMongoDB } from '@/middlewares/conexaoMongoDB';
import { usuariosModel } from '@/models/usuariosModel';
import nc from 'next-connect';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { validacaoJWT } from '@/middlewares/validacaoJWT';
import { politicaCors } from '@/middlewares/politicaCors';

const handler = nc()
.get(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {
    const usuarios = await usuariosModel.find();

    return res.status(200).json({ data: usuarios });
})

export const config = {
    api: {
        bodyParser: false
    }
}
export default politicaCors(validacaoJWT(conexaoMongoDB(handler)));