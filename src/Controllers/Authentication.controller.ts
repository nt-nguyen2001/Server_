import { NextFunction, Request, Response } from "express";
import Announcement from "../Database/announcement.database";
import Authentication from "../Database/authentication.database";
import { MessagesNotificationsDB } from "../Database/MessagesNotifications.database";
import User from "../Database/user.database";
import { RequestWithPayload, TUser } from "../Types";
import { NewError, ResponseError } from "../Utils/CustomThrowError.Utils";
import VerifyToken from "../Utils/VerifyToken.Utils";

export async function login(
  req: RequestWithPayload<Partial<TUser>>,
  res: Response,
  next: NextFunction
) {
  const { _account, _password }: TUser = req.body?.payload || {
    _account: "",
    _password: "",
  };

  if (_account && _password) {
    const payload = await Authentication.Login(_account, _password);
    req.payload = [payload];

    return next();
  } else throw new ResponseError("Payload empty!", 400);
}

export async function logOut(req: Request, res: Response) {
  const refreshToken =
    (req.headers["refresh-token"] &&
      (req.headers["refresh-token"] as string).split(" ")[1]) ||
    "null";
  await Authentication.Logout(refreshToken);
  res.status(200).send({ status: 200, message: "OK" });
}

export async function register(req: RequestWithPayload<TUser>, res: Response) {
  const payload: TUser = req.body?.payload;
  if (Object.values(payload).every((item) => item)) {
    await Authentication.Register(payload)
      .then(async () => {
        await Announcement.createAnnouncements({ _userId: payload._userId });
        await MessagesNotificationsDB.create({
          UID: payload._userId,
          quantity: 0,
        });
        res.status(200).send({ status: 200, message: "OK" });
      })
      .catch((err) => {
        const { error, message } = err as NewError;
        console.log(err);
        if (error) {
          res.status(error).send({ status: error, message: message });
        } else {
          res
            .status(500)
            .send({ status: 500, message: "Internal Sever Error!" });
        }
      });
  } else {
    throw new ResponseError("payload empty!", 400);
  }
}

export async function refreshToken(
  req: RequestWithPayload<Partial<TUser>>,
  res: Response,
  next: NextFunction
) {
  const refreshToken =
    (req.cookies?.refreshToken && req.cookies?.refreshToken.split(" ")[1]) ||
    null;

  if (refreshToken) {
    const token = await Authentication.RefreshToken(refreshToken);

    if (token.length >= 1) {
      const { decoded } = await VerifyToken(refreshToken);
      req.payload = [
        {
          _userId: decoded?._userId || "",
          role: decoded?.role || "",
        },
      ];
      return next();
    }
  }
  throw new ResponseError("invalid token", 400);
}

export async function CheckUserExists(req: Request, res: Response) {
  const slug = req.params?.slug;
  if (slug) {
    const payload = await Authentication.CheckUserExists(slug);
    if (payload.length === 0) {
      return res.status(200).json({ status: 200, message: "OK" });
    }
    throw new ResponseError("User exists already!", 400);
  }
  throw new ResponseError("Account is empty!", 400);
}
export async function VerifyLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token =
    (req.headers["access-token"] &&
      (req.headers["access-token"] as string).split(" ")[1]) ||
    null;

  if (token) {
    const { decoded } = await VerifyToken(token);
    const { _userId, role } = decoded || { _userId: "", role: "" };
    const user = await User.getById(decoded?._userId || "");
    const {
      avatar,
      background_img,
      _name,
      _userName,
      _phoneNumber,
      _account,
      _createAt,
    } = user?.[0] || {
      _userName: "",
      background_img: "",
      avatar: "",
      _name: "",
      _createAt: "",
    };
    res.status(200).send({
      payload: [
        {
          _userId,
          role,
          avatar,
          background_img,
          _name,
          _userName,
          _phoneNumber,
          _account,
          _createAt,
        },
      ],
      message: "OK",
      status: 200,
    });
  } else {
    res.status(400).send({
      message: "Invalid",
      status: 400,
    });
  }
}
