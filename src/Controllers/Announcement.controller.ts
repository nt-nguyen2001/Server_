import { Request, Response } from "express";
import Announcement from "../Database/announcement.database";
import { ResponseError } from "../Utils/CustomThrowError.Utils";

export interface AnnouncementData {
  _idAnnouncement: string;
  _fromUser: string;
  _idOther: string;
  _userId: string;
  _idLink: string;
  _typeLink: string;
  _type: string;
  _createAt: string;
  state: boolean;
}

export async function GetDetailedAnnouncements(req: Request, res: Response) {
  const _userId = req.params.id as string;
  const payload = await Announcement.getDetailedAnnouncements({ _userId });
  res.send({ status: 200, message: "OK", payload });
}

export async function GetAnnouncements(req: Request, res: Response) {
  const _userId = req.params.id as string;
  const data = await Announcement.getAnnouncements({ _userId });
  const { quantity } = data?.[0] || { quantity: 0 };
  res.send({ status: 200, message: "OK", payload: { quantity } });
}

export async function CreateDetailedAnnouncements(req: Request, res: Response) {
  const payload = req.body.payload as AnnouncementData;

  const task1 = Announcement.create(payload);
  const task2 = Announcement.UpdateAnnouncements({ _userId: payload._userId });
  await Promise.all([task1, task2]);
  res.send({ status: 200, message: "OK" });
}
export async function CreateAnnouncements(req: Request, res: Response) {
  const _userId = req.body._userId as string;
  if (!_userId) throw new ResponseError("payload is Null");

  res.send({ status: 200, message: "OK" });
}
export async function ReadAnnouncements(req: Request, res: Response) {
  const idAnnouncement = req.body.payload.id as string;
  if (!idAnnouncement) throw new ResponseError("payload is NULL");
  const payload = await Announcement.ReadAnnouncements(idAnnouncement);
  res.send({ status: 200, message: "OK", payload });
}
export async function CheckAnnouncements(req: Request, res: Response) {
  const _userId = req.body.payload._userId as string;
  await Announcement.CheckAnnouncements({ _userId });
  res.send({ status: 200, message: "OK" });
}
// export async function DeleteByPostId(req: Request, res: Response) {
//   const postId = req.query.postId;
//   if (typeof postId === "string") {
//     await Announcement.deleteByPostId(postId);
//   } else {
//     throw new ResponseError("Typeof query wrong!");
//   }
//   res.send({ status: 200, message: "OK" });
// }
export async function DeleteDetailedAnnouncement(req: Request, res: Response) {
  const idAnnouncement = req.query.idAnnouncement;
  const userId = req.query.userId;
  if (typeof idAnnouncement === "string" && typeof userId === "string") {
    await Announcement.deleteByIdAnnouncement(idAnnouncement, userId);
  } else {
    throw new ResponseError("Typeof query wrong!");
  }
  res.send({ status: 200, message: "OK" });
}
export async function DeleteDetailedAnnouncementByIdOther(
  req: Request,
  res: Response
) {
  const _idOther = req.query.id;
  const userId = req.query.userId;
  if (typeof _idOther === "string" && typeof userId === "string") {
    await Announcement.deleteByIdOther({ userId, _idOther });
  } else {
    throw new ResponseError("Typeof query wrong!");
  }
  res.send({ status: 200, message: "OK" });
}
