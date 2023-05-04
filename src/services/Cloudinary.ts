import { v2 as cloudinary } from "cloudinary";
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const Cloudinary = {
  uploads(
    file: string,
    folder?: string
  ): Promise<{ url: string | undefined; id: string | undefined }> {
    return new Promise((resolve) => {
      cloudinary.uploader.upload(
        file,
        {
          resource_type: "auto",
          folder,
          use_filename: true,
          unique_filename: false,
          overwrite: false,
        },
        (err, res) => {
          resolve({
            url: res?.url,
            id: res?.public_id,
          });
        }
      );
    });
  },
};
export { Cloudinary };
