import aws from "aws-sdk";
import multer from "fastify-multer";
import multerS3 from "multer-s3";

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const multerFilter = (_, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload images only.', 400), false);
    }
  };

export const upload = multer({
    storage: multerS3({
        s3: s3,

        bucket: 'odbprojectbucket',
        metadata: function (_, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (_, file, cb) {
            let fileExtension = file.originalname.split('.').pop();
            cb(null, Date.now().toString() + '.' + fileExtension)
        },
        contentType: multerS3.AUTO_CONTENT_TYPE
    }),
    fileFilter: multerFilter
})