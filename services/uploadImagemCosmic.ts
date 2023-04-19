import multer from 'multer';
import cosmicjs from 'cosmicjs';

const { CHAVE_IMAGENS_AVATAR,
    BUCKET_AVATARES,
    CHAVE_IMAGENS_DOACOES,
    BUCKET_DOACOES } = process.env;

const Cosmic = cosmicjs();

const bucketAvatares = Cosmic.bucket({
    slug: BUCKET_AVATARES,
    write_key: CHAVE_IMAGENS_AVATAR
});

const bucketDoacoes = Cosmic.bucket({
    slug: BUCKET_DOACOES,
    write_key: CHAVE_IMAGENS_DOACOES
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadImagemCosmic = async (req: any) => {
    if (req?.file?.originalname) {


        if (!req.file.originalname.includes('.png') &&
            !req.file.originalname.includes('.PNG') &&
            !req.file.originalname.includes('.jpg') &&
            !req.file.originalname.includes('.JPG') &&
            !req.file.originalname.includes('.jpeg') &&
            !req.file.originalname.includes('.JPEG')) {
            throw new Error('A extensão da imagem é inválida.');
        }

        const media_object = {
            originalname: req.file.originalname,
            buffer: req.file.buffer
        };

        if (req.url && req.url.includes('doacoes')) {
            return await bucketDoacoes.addMedia({ media: media_object });
        } else {
            return await bucketAvatares.addMedia({ media: media_object });
        }
    }
}

export { upload, uploadImagemCosmic };