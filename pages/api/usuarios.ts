import type { NextApiRequest, NextApiResponse } from 'next';
import { conexaoMongoDB } from '@/middlewares/conexaoMongoDB';
import { usuariosRequest } from '@/types/usuariosRequest';
import { usuariosModel } from '@/models/usuariosModel';
import md5 from 'md5';
import nc from 'next-connect';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { carregar, uploadImagemCosmic } from "../../services/uploadImagemCosmic"

const endpointUsuarios = nc()
    .use(carregar.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse) => {

        try {
            const usuario = req.body as usuariosRequest as any;

            if (!usuario) {
                return res.status(400).json({ msg: "Requisição inválida" });
            }

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

            const image = await uploadImagemCosmic(req);

            const usuarioQueSeraSalvo = {
                nome: usuario.nome,
                email: usuario.email,
                senha: md5(usuario.senha),
                endereco: usuario.endereco,
                nascimento: usuario.nascimento,
                celular: usuario.celular,
                avatar: image?.media?.url
            }
            await usuariosModel.create(usuarioQueSeraSalvo);

            return res.status(201).json({ msg: 'Usuário cadastrado com sucesso' });
        } catch (e: any) {
            console.log(e)
            return res.status(500).json({ erro: 'Erro ao cadastrar. Desculpe e tente novamente!' });
        }

    })
    .get(async (req: NextApiRequest, res: NextApiResponse) => {
        const usuarios = await usuariosModel.find();

        return res.status(200).json({ data: usuarios });
    })
    .put(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {
        try {
            const { userId } = req?.query;
            const usuario = await usuariosModel.findById(userId);

            if (!usuario) {
                return res.status(400).json({ erro: 'Usuario nao encontrado' });
            }

            const { nome } = req?.body;
            if (nome && nome.length > 2) {
                usuario.nome = nome;
            }

            const { file } = req;
            if (file && file.nomeOriginal) {
                const image = await uploadImagemCosmic(req);
                if (image && image.media && image.media.url) {
                    usuario.avatar = image.media.url;
                }
            }

            await usuariosModel
                .findByIdAndUpdate({ _id: usuario._id }, usuario);

            return res.status(200).json({ msg: 'Usuario alterado com sucesso' });
        } catch (e) {
            console.log(e);
            return res.status(400).json({ erro: 'Nao foi possivel atualizar usuario:' + e });
        }
    });

export const config = {
    api: {
        bodyParser: false
    }
}

export default conexaoMongoDB(endpointUsuarios);