import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { conexaoMongoDB } from '@/middlewares/conexaoMongoDB';
import { validacaoJWT } from '@/middlewares/validacaoJWT';
import { doacoesModel } from '@/models/doacoesModel';
import { politicaCors } from '@/middlewares/politicaCors';


const handler = nc()
.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const doacoes = await doacoesModel.find();

    return res.status(200).json({ data: doacoes });
});

export default politicaCors(validacaoJWT(conexaoMongoDB(handler)));