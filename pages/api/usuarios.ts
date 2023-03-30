import type {NextApiRequest, NextApiResponse} from 'next';
import { conexaoMongoDB } from '@/middlewares/conexaoMongoDB';
import { usuariosRequest } from '@/types/usuariosRequest';

const endpointCadastro = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === "POST"){
        const usuario = req.body as usuariosRequest;

        if (!usuario.nome || usuario.nome.length < 2 ){
            return res.status(400).json({ erro: "Informe um nome válido!"});
        }

        if (!usuario.email ||
            usuario.email.length < 11 ||
            !usuario.email.includes('@') ||
            !usuario.email.includes('.') ){
            return res.status(400).json({ erro: "Informe um email válido!"});
            }

        if (!usuario.senha || usuario.senha.length < 8 || !usuario.senha.includes("ABCDEFGHIJKLMNOPQRSTVXZ")){
            return res.status(400).json({ erro: "Informe uma senha válida!"});
        }

        if (!usuario.endereco || usuario.endereco.length < 5){
            return res.status(400).json({ erro: "Informe um endereço válido!"});
        }

        if (!usuario.nascimento || usuario.nascimento < 8){
            return res.status(400).json({ erro: "Informe uma data de nascimento válida!"});
        }

        if (!usuario.celular || usuario.celular < 11){
            return res.status(400).json({ erro: "Informe um número de celular válido!"});
        }


      

 }


}