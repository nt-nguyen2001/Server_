import { Request, Response } from "express";
import Announcement from "../Database/announcement.database";
import { MessagesNotificationsDB } from "../Database/MessagesNotifications.database";
import { ResponseError } from "../Utils/CustomThrowError.Utils";

export async function IncreaseMessagesNotifications(
  req: Request,
  res: Response
) {
  const toUID = req.body.payload;
  if (!toUID) {
    throw new ResponseError("UID is empty!");
  }
  await MessagesNotificationsDB.increase({ UID: toUID });
  res.send({ status: 200, message: "OK" });
}
export async function GetNumberOfMessagesNotifications(
  req: Request,
  res: Response
) {
  const _UID = req.params.id as string;
  if (!_UID) {
    throw new ResponseError("Id is empty!");
  }
  const numberOfMessages = await MessagesNotificationsDB.get({
    _UID,
  });
  res.send({
    status: 200,
    message: "OK",
    payload: { numberOfMessages: numberOfMessages?.[0].quantity },
  });
}
export async function CheckMessagesNotifications(req: Request, res: Response) {
  const _UID = req.params.id;
  if (!_UID) {
    throw new ResponseError("UID is empty!");
  }
  await MessagesNotificationsDB.check({ _UID });
  res.send({ status: 200, message: "OK" });
}
