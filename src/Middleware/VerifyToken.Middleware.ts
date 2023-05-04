import { NextFunction, Request, Response } from "express";
import { RequestWithPayload } from "../Types";
import { ResponseError } from "../Utils/CustomThrowError.Utils";
import VerifyTokenUtils from "../Utils/VerifyToken.Utils";

const VerifyToken =
  (role: string) =>
  async (
    req: RequestWithPayload<Object>,
    res: Response,
    next: NextFunction
  ) => {
    const token =
      (req.cookies.accessToken && req.cookies.accessToken.split(" ")[1]) ||
      null;
    const payload = await VerifyTokenUtils(token);

    if (payload.decoded?.role === role) {
      req.payload = [payload.decoded];
      return next();
    }
  };
export default VerifyToken;
