import type { NextApiRequest, NextApiResponse } from "next";
import { validacaoJWT } from "@/middlewares/validacaoJWT";


const endpointVerificarUsuarioToken = (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(200).json(`Usuário autenticado com sucesso!`);
}

export default validacaoJWT(endpointVerificarUsuarioToken)