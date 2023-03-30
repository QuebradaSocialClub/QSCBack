import type { NextApiRequest, NextApiResponse } from 'next';
import { conexaoMongoDB } from '@/middlewares/conexaoMongoDB';
import { usuariosRequest } from '@/types/usuariosRequest';
import { usuariosModel } from '@/models/usuariosModel';

const endpointCadastro = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === 'POST') {
        const usuario = req.body as usuariosRequest;

        if (!usuario.nome || usuario.nome.length < 2) {
            return res.status(400).json({ erro: "Informe um nome válido!" });
        }

        if (!usuario.email ||
            usuario.email.length < 11 ||
            !usuario.email.includes('@') ||
            !usuario.email.includes('.')) {
            return res.status(400).json({ erro: "Informe um email válido!" });
        }

        if (!usuario.senha || usuario.senha.length < 8) {
            return res.status(400).json({ erro: "Informe uma senha válida!" });
        }

        if (!usuario.endereco || usuario.endereco.length < 5) {
            return res.status(400).json({ erro: "Informe um endereço válido!" });
        }

        if (!usuario.nascimento || usuario.nascimento < 8) {
            return res.status(400).json({ erro: "Informe uma data de nascimento válida!" });
        }

        if (!usuario.celular || usuario.celular < 11) {
            return res.status(400).json({ erro: "Informe um número de celular válido!" });
        }

        const usuariosComMesmoEmail = await usuariosModel.find({ email: usuario.email });
        if (usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0) {
            return res.status(400).json({ erro: "Email já cadastrado. Verifique!" })
        }

        const usuarioQueSeraSalvo = {
            nome: usuario.nome,
            email: usuario.email,
            senha: usuario.senha,
            endereco: usuario.endereco,
            nascimento: usuario.nascimento,
            avatar: usuario.avatar,
            celular: usuario.celular
        }
        await usuariosModel.create(usuarioQueSeraSalvo);
        return res.status(201).json({ msg : 'Usuário cadastrado com sucesso'});
    }
    return res.status(405).json({ erro : 'Método informado não é válido'});
}

export default conexaoMongoDB(endpointCadastro);