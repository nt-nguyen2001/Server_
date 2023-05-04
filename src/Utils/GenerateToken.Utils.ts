import jwt from "jsonwebtoken";

export default function generateToken(
  payload: object,
  option: jwt.SignOptions
) {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, process.env.SECRET_KEY || "ASD", option, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token || "");
    });
  });
}
