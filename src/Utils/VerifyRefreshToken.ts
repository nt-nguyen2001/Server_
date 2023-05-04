import { NextFunction, Request, Response } from "express";
import VerifyToken from "./VerifyToken.Utils";
import User from "../Database/user.database";
import { RequestWithPayload, TUser } from "../Types";

const VerifyRefreshToken = async (
  req: RequestWithPayload<Partial<TUser>>,
  res: Response,
  next: NextFunction
) => {
  const token =
    (req.headers["refresh-token"] &&
      (req.headers["refresh-token"] as string).split(" ")[1]) ||
    null;
  if (token) {
    const { decoded } = await VerifyToken(token);
    const { _userId, role } = decoded || { _userId: "", role: "" };
    const user = await User.getById(decoded?._userId || "");
    const payload = user?.[0];
    req.payload = [payload];
    next();
  } else {
    res.status(400).send({
      message: "Invalid",
      status: 400,
    });
  }
};
export { VerifyRefreshToken };
