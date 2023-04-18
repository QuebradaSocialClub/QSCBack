import multer from 'multer';
import cosmicjs from 'cosmicjs';

const { CHAVE_IMAGENS_AVATAR,
    BUCKET_AVATARES,
    CHAVE_IMAGENS_DOACOES,
    BUCKET_DOACOES } = process.env;

const Cosmic = cosmicjs();

const uploadAvatares = Cosmic.bucket({
    slug: BUCKET_AVATARES,
    write_key: CHAVE_IMAGENS_AVATAR
});

const uploadDoacoes = Cosmic.bucket({
    slug: BUCKET_DOACOES,
    write_key: CHAVE_IMAGENS_DOACOES
});

const armazenar = multer.memoryStorage();
const carregar = multer({ storage: armazenar });

const uploadImagemCosmic = async (req: any) => {

    if (req.file.nomeOriginal) {
        const media_object = {
            nomeOriginal: req.file.nomeOriginal,
            buffer: req.file.buffer
        };

        if (req.url && req.url.includes('doacoes')) {
            return await uploadDoacoes.addMedia({ media: media_object });
        } else {
            return await uploadAvatares.addMedia({ media: media_object });
        }

    }
}

export { carregar, uploadImagemCosmic };
