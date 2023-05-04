import { NextFunction, Response } from "express";
import { DB } from "../Database";
import { RequestWithPayload } from "../Types";
import generateToken from "../Utils/GenerateToken.Utils";

async function assignRefreshToken(
  req: RequestWithPayload<Object>,
  res: Response,
  next: NextFunction
) {
  const payload = req?.payload?.[0] || { null: "null" };
  const refreshToken = await generateToken(payload, {
    expiresIn: "1d",
  });
  const __instance = DB.getInstance();
  await __instance._execute("Insert into refreshToken values(?,?)", [
    refreshToken,
    new Date(Date.now() + 24 * 3600000),
  ]);
  res.cookie("refreshToken", "Bearer " + refreshToken, {
    expires: new Date(Date.now() + 24 * 3600000),
    httpOnly: true,
    domain: ".onrender.com",
    sameSite: "none",
    // secure: true,
  });

  next();
}

export default assignRefreshToken;
