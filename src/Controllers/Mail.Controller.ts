import { Request, Response } from "express";
import { DB } from "../Database";
import Mail from "../Database/mail.database";
import { generateOTP } from "../Utils/GenerateOTP.Utils";
import sendMail from "../Utils/SendMail.Utils";

export async function mailRegister(req: Request, res: Response) {
  const token = generateOTP(req.body.account);
  await Mail.CreateOTP(token, req.body.account);
  sendMail(req.body.account, `OTP: ${token}`);
  res.sendStatus(200);
}
