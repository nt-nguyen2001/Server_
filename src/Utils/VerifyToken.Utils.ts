import jwt, { TokenExpiredError } from "jsonwebtoken";
import { ResponseError } from "./CustomThrowError.Utils";

export interface payLoad {
  _userId: string;
  role: string;
  iat: number;
  exp: number;
}

export default async function VerifyToken(token: string) {
  let payload: {
    error: number;
    message: string;
    decoded?: payLoad;
  };
  try {
    // type can't determined in callback of verify
    if (token === null) {
      throw new ResponseError("Bad Request!", 400);
    }
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY || "ASD"
    ) as payLoad;
    payload = {
      error: 200,
      message: "OK",
      decoded,
    };
  } catch (err) {
    const tokenError = err as TokenExpiredError;
    payload = {
      error: 400,
      message: tokenError.message,
    };
    throw payload;
  }
  return payload;
}
