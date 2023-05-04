import { NextFunction, Response } from "express";
import { DB } from "../Database";
import { RequestWithPayload } from "../Types";
import generateToken from "../Utils/GenerateToken.Utils";

async function assignToken(
  req: RequestWithPayload<Object>,
  res: Response,
  next: NextFunction
) {
  const payload = req?.payload?.[0] || { null: "null" };
  const accessToken = await generateToken(payload, { expiresIn: "3h" });
  const refreshToken = await generateToken(payload, {
    expiresIn: "1d",
  });
  const __instance = DB.getInstance();
  await __instance._execute("Insert into refreshToken values(?,?)", [
    refreshToken,
    new Date(Date.now() + 24 * 3600000),
  ]);
  res.status(200).send({
    status: 200,
    message: "OK",
    payload: {
      user: req.payload,
      token: {
        accessToken: "Bearer " + accessToken,
        refreshToken: "Bearer " + refreshToken,
      },
    },
  });
}

export default assignToken;
