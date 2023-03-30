import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import mongoose from 'mongoose';

export const conexaoMongoDB = (handler: NextApiHandler) => 
    async (req: NextApiRequest, res: NextApiResponse) => {
        if (mongoose.connections[0].readyState){
            return handler(req, res);
        }

    const {CONEXAO_STRING} = process.env;

    if (!CONEXAO_STRING){
        return res.status(500).json({error: "ENV (valor da variável de ambiente) não informada."});
    }

    mongoose.connection.on('connected', () => console.log("Banco de dados conectado!"));
    mongoose.connection.on('error', error => console.log(`Falha ao conectar o banco de dados: ${error}!`));

    await mongoose.connect(CONEXAO_STRING);

    return handler(req, res);
 }
