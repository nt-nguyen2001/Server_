import { Request, Response } from "express";
import { Friends } from "../Database/friends.db";
import { FriendsProps, FriendsStatus } from "../Types/Friends.type";
import { ResponseError } from "../Utils/CustomThrowError.Utils";
import { createHash } from "crypto";
import Announcement from "../Database/announcement.database";
import { CombineIDs } from "../Utils/CombineIDs.Utils";

// function isCompare(id1: string, id2: string, index: number) {
//   if (id1.charCodeAt(index) > id2.charCodeAt(index)) return 1;
//   if (id1.charCodeAt(index) < id2.charCodeAt(index)) return -1;
//   return 0;
// }

export async function MakeFriends(req: Request, res: Response) {
  const payload = req.body.payload as FriendsProps;
  const id = CombineIDs(payload._UID1, payload._UID2);
  // let id = createHash("md5")
  //   .update(`${payload._UID1}${payload._UID2}`)
  //   .digest("hex");

  // for (let i = 0; i < payload._UID1.length; i++) {
  //   let isBreak = false;
  //   switch (isCompare(payload._UID1, payload._UID2, i)) {
  //     case -1:
  //       isBreak = true;
  //       id = createHash("md5")
  //         .update(`${payload._UID2}${payload._UID1}`)
  //         .digest("hex");
  //       break;
  //     case 1:
  //       isBreak = true;
  //       break;
  //   }
  //   if (isBreak) {
  //     break;
  //   }
  // }

  payload._idFriends = id;

  if (!payload) {
    throw new ResponseError("Payload is empty!");
  }
  await Friends.create(payload);
  res.send({ message: "OK", status: 200, payload });
}

export async function GetFriendStatus(req: Request, res: Response) {
  const id1 = req.query.id1 as string;
  const id2 = req.query.id2 as string;
  const _idFriends1 = createHash("md5").update(`${id1}${id2}`).digest("hex");
  const _idFriends2 = createHash("md5").update(`${id2}${id1}`).digest("hex");

  if (!id1 || !id2) {
    throw new ResponseError(`Id is empty!`);
  }

  const payload = await Friends.getFriendStatus({
    id1: _idFriends1,
    id2: _idFriends2,
  });
  let status: FriendsStatus | null = Number(payload[0]?._status);

  switch (status) {
    case FriendsStatus.Pending:
      if (id1 !== payload[0]._UID1) {
        status = FriendsStatus["Confirm Request"];
      } else {
        status = FriendsStatus.Pending;
      }
      break;
  }

  res.send({
    message: "OK",
    status: 200,
    payload: {
      _createAt: payload?.[0]?._createAt ?? null,
      _status: status,
      _idFriends: payload?.[0]?._idFriends ?? null,
    },
  });
}

export async function DeleteInvitation(req: Request, res: Response) {
  const id = req.params.id as string;
  const userId = req.params.userId as string;

  if (!id) {
    throw new ResponseError(`Id is empty!`);
  }
  await Announcement.deleteByIdOther({ _idOther: id, userId });
  await Friends.deleteInvitation({ _idFriends: id });

  res.send({
    message: "OK",
    status: 200,
  });
}

export async function AcceptFriends(req: Request, res: Response) {
  const payload = req.body.payload as Pick<
    FriendsProps,
    "_createAt" | "_idFriends" | "_status"
  >;
  payload._status = FriendsStatus.Friends;

  await Friends.acceptFriends(payload);

  res.send({
    message: "OK",
    status: 200,
    payload,
  });
}

export async function GetInfoFriends(req: Request, res: Response) {
  const _userId = req.params.id as string;
  const limit = req.query.limit as string;

  if (!_userId) {
    throw new ResponseError("userId is empty");
  }

  const payload = await Friends.getInfoFriends({
    _userId,
    limit: Number(limit || 9),
  });
  const [quantity, infoFriends] = payload;
  res.send({
    status: 200,
    message: "OK",
    payload: {
      quantity: quantity?.[0]?.quantity,
      infoFriends,
    },
  });
}
