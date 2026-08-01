import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const saveFileToCloudinary = (fileBuffer, userId) => {
  if (!Buffer.isBuffer(fileBuffer)) {
    throw new TypeError('fileBuffer must be a Buffer');
  }

  const options = {
    folder: 'avatars',
    resource_type: 'image',
    overwrite: true,
    public_id: `avatar_${userId}`,
    unique_filename: false
  };

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        return reject(error);
      }

      resolve(result);
    });

    stream.end(fileBuffer);
  });
};
