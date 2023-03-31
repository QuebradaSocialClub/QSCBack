import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";

export const validacaoJWT = (handler: NextApiHandler) =>
    (req: NextApiRequest, res: NextApiResponse) => {

        try {
            const { CHAVE_JWT } = process.env;
            if (!CHAVE_JWT) {
                return res.status(500).json({ erro: 'ENV da chave JWT não informada' });
            }

            if (!req || !req.headers) {
                return res.status(401).json({ erro: 'Não foi possível validar o token de acesso' });
            }

            if (req.method !== 'OPTIONS') {
                const authorization = req.headers['authorization'];
                if (!authorization) {
                    return res.status(401).json({ erro: 'Não foi possível validar o token de acesso' });
                }
                const token = authorization.substring(7);
                if (!token) {
                    return res.status(401).json({ erro: 'Não foi possível validar o token de acesso' });
                }

                const decoded = jwt.verify(token, CHAVE_JWT) as JwtPayload;
                if (!decoded) {
                    return res.status(401).json({ erro: 'Não foi possível validar o token de acesso' });
                }

                if (!req.query) {
                    req.query = {};
                }

                req.query.userId = decoded._id;
            }

        } catch (e) {
            console.log(e);
            return res.status(401).json({ erro: 'Não foi possível validar o token de acesso' });
        }

        return handler(req, res);
    }
