import type { NextApiRequest, NextApiResponse } from "next";
import { usuariosModel } from "@/models/usuariosModel";
import { conexaoMongoDB } from "@/middlewares/conexaoMongoDB";
import md5 from 'md5';
import jwt from 'jsonwebtoken';

const endpointLogin = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    const { CHAVE_JWT } = process.env;
    if (!CHAVE_JWT) {
        return res.status(500).json({ erro: `ENV Jwt não informada` })
    }

    if (req.method == 'POST') {
        const { login, senha } = req.body;

        const usuariosEncontrados = await usuariosModel.find({ email: login, senha: md5(senha) })
        if (usuariosEncontrados && usuariosEncontrados.length > 0) {
            const usuarioEncontrado = usuariosEncontrados[0];

            const token = jwt.sign({ _id: usuarioEncontrado._id }, CHAVE_JWT);
            return res.status(200).json({
                nome: usuarioEncontrado.nome,
                email: usuarioEncontrado.email,
                token
            });
        }
        return res.status(400).json({ erro: 'Usuário ou senha incorreta' });
    }
    return res.status(405).json({ erro: 'Método informado inválido' });
}
export default conexaoMongoDB(endpointLogin);

