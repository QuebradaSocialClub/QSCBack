import type { NextApiRequest, NextApiResponse } from 'next';
import { conexaoMongoDB } from '@/middlewares/conexaoMongoDB';
import { usuariosRequest } from '@/types/usuariosRequest';
import { usuariosModel } from '@/models/usuariosModel';
import md5 from 'md5';
import nc from 'next-connect';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { upload, uploadImagemCosmic } from "../../services/uploadImagemCosmic"

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
        try {
            const usuario = req.body as usuariosRequest;

            //validações
            if (!usuario.nome || usuario.nome.length < 2) {
                return res.status(400).json({ erro: 'Informe um nome válido.' });
            }

            if (!usuario.email || usuario.email.length < 5
                || !usuario.email.includes('@')
                || !usuario.email.includes('.')) {
                return res.status(400).json({ erro: 'Informe um email válido.' });
            }

            if (!usuario.senha || usuario.senha.length < 4) {
                return res.status(400).json({ erro: 'informe uma senha válida.' });
            }

            if (!usuario.endereco || usuario.endereco.length < 5) {
                return res.status(400).json({ erro: "Informe um endereço válido!" });
            }

            if (!usuario.celular || usuario.celular.length < 11) {
                return res.status(400).json({ erro: "Informe um número de celular válido!" });
            }

            // coonferindo se já existe uma conta
            const usuariosComMesmoEmail = await usuariosModel.find({ email: usuario.email });
            if (usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0) {
                return res.status(400).json({ erro: 'Já existe uma conta com o email informado.' });
            }

            // enviando a imagem do multer para o cosmic
            const image = await uploadImagemCosmic(req);

            // salvando no banco de dados
            const usuarioASerSalvo = {
                nome: usuario.nome,
                email: usuario.email,
                senha: md5(usuario.senha),
                endereco: usuario.endereco,
                nascimento: usuario.nascimento,
                celular: usuario.celular,
                avatar: image?.media?.url
            }
            await usuariosModel.create(usuarioASerSalvo);
            return res.status(201).json({ msg: 'Conta criada com sucesso.' });
        } catch (e: any) {
            console.log(e);
            return res.status(500).json({ erro: "Não foi possível criar essa conta: " + e.toString() });
        }
    })
    .put(async(req : any, res : NextApiResponse<RespostaPadraoMsg>) => {
        try{
            const {userId} = req?.query;
            const usuario = await usuariosModel.findById(userId);
            
            if(!usuario){
                return res.status(404).json({erro : 'Perfil de usuário não encontrado'});
            }

            const {nome} = req?.body;
            if(nome && nome.length > 2){
                usuario.nome = nome;
            }

            const {file} = req;
            if(file && file.originalname){
                const image = await uploadImagemCosmic(req);
                if(image && image.media && image.media.url){
                    usuario.avatar = image.media.url;
                } 
            }

            await usuariosModel
                .findByIdAndUpdate({_id : usuario._id}, usuario);

            return res.status(200).json({msg : 'Perfil alterado com sucesso'});
        }catch(e){
            console.log(e);
            return res.status(400).json({erro : 'Não foi possível atualizar seu perfil:' + e});
        }
    })
    .get(async (req: NextApiRequest, res: NextApiResponse) => {
        const usuarios = await usuariosModel.find();

        return res.status(200).json({ data: usuarios });
    })

export const config = {
    api: {
        bodyParser: false
    }
}
export default conexaoMongoDB(handler);