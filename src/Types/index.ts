import { Request } from "express";

export interface TUser {
  _userId: string;
  _account: string;
  _name: string;
  _userName: string;
  _password: string;
  _phoneNumber: string;
  avatar: string;
  background_img: string;
  role: string;
  otp: string;
  _createAt: string;
}
export interface RequestWithPayload<T> extends Request {
  payload?: T[];
}
export interface OTP {
  token: string;
  _account: string;
  _expire: Date;
}
