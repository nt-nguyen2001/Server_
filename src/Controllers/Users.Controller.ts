import { Request, Response } from "express";
import User from "../Database/user.database";
import { TUser } from "../Types";
import { ResponseError } from "../Utils/CustomThrowError.Utils";
import { DeleteImage } from "../Utils/DeleteImage.Utils";

export async function getUserByAccount(req: Request, res: Response) {
  const account = req.query?.account as string;
  const payload = await User.getByAccount(account);
  res.status(200).json({ status: 200, payload });
}
export async function getUserByUserName(req: Request, res: Response) {
  const userName = req.params?.userName as string;
  const payload = await User.getByUserName(userName);
  res.status(200).json({ status: 200, payload });
}
export async function getUsers(req: Request, res: Response) {
  const payload = await User.getAll();
  return res.status(200).json({ status: 200, payload });
}
export async function getUsersById(req: Request, res: Response) {
  const userId = req.params.id as string;
  if (!userId) {
    throw new ResponseError("User id is empty!");
  }
  const user = await User.getById(userId);

  return res.status(200).json({ status: 200, payload: user });
}
export async function updateUser(req: Request, res: Response) {
  const payload = req.body.payload;
  if (payload) {
    const data: string[] = Object.values(payload);
    const field = Object.keys(payload);
    const id = req.params.id;

    const fieldImage = field.reduce<string[]>((prev, curr) => {
      if (curr === "avatar" || curr === "background_img") {
        return [...prev, curr];
      }
      return prev;
    }, []);
    if (fieldImage.length) {
      const res = await User.getById(id);
      fieldImage?.map((key) => {
        if (res[0][key as keyof TUser]) {
          DeleteImage(res[0][key as keyof TUser]);
        }
      });
    }
    await User.update(field, data, id);
    const user = await User.getById(id);
    res.send({ status: 200, message: "OK", payload: user });
  } else {
    throw new ResponseError("Payload Empty !", 400);
  }
}

export async function deleteImage(req: Request, res: Response) {
  if (req.params.id) {
    DeleteImage(req.params.id);
    res.send({ status: 200, message: "OK" });
  } else {
    res.send({ status: 400, message: "Bad Request" });
  }
}

export async function UpdateInfoUser(req: Request, res: Response) {
  const payload = req.body.payload as TUser;
  const { _userId, ...props } = payload;
  if (!_userId) {
    throw new ResponseError("userId is empty");
  }
  await User.updateInfo(props, _userId);
  res.send({ status: 400, message: "OK" });
}
export async function CheckExistedUserName(req: Request, res: Response) {
  const id = req.params.id as string;
  if (!id) {
    throw new ResponseError("id is empty");
  }
  const response = await User.checkExistedUserName({ _userName: id });
  if (response.length >= 1) {
    throw new ResponseError("Username is exist", 400);
  }
  res.send({ status: 200, message: "OK" });
}
export async function ChangePass(req: Request, res: Response) {
  const id = req.params.id as string;
  const oldPass = req.query.pass as string;
  const newPass = req.body.payload.pass as string;
  let status = 200;
  let message = "The password was changed successfully";

  if (!id || !oldPass || !newPass) {
    throw new ResponseError("id or pass is empty");
  }
  const response = await User.changePass({ UID: id, newPass, oldPass });
  if (response.err) {
    status = 401;
    message = response.err;
  }
  res.send({ status, message });
}

export async function SearchUserByName(req: Request, res: Response) {
  const userName = req.params.userName as string;
  if (!userName) {
    throw new ResponseError("user name is empty!");
  }
  const users = await User.searchUserByName({ userName });
  res.send({ status: 200, message: "OK", payload: users });
}
