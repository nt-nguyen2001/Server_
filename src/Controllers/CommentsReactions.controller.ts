import { Request, Response } from "express";
import { CommentsReactions } from "../Database/commentsReactions.db";
import { CommentsReactionsProps } from "../Types/reaction.type";
import { ResponseError } from "../Utils/CustomThrowError.Utils";

export async function CreateReactions(req: Request, res: Response) {
  const payload = req.body.payload as CommentsReactionsProps;
  if (!payload) {
    throw new ResponseError("Payload is empty!");
  }
  await CommentsReactions.create(payload);
  res.send({ status: 200, message: "OK" });
}
export async function GetReactions(req: Request, res: Response) {
  // const _commentId = req.params.id as string;
  // if (!_commentId) {
  //   throw new ResponseError("Id is empty!");
  // }
  // const [reactions, topReactions] = await CommentsReactions.get({ _commentId });
  // res.send({
  //   status: 200,
  //   message: "OK",
  //   payload: {
  //     reactions,
  //     topReactions,
  //   },
  // });
}
export async function UpdateReactions(req: Request, res: Response) {
  const _reactionId = req.params.id as string;
  const _type = req.body.payload as string;
  if (!_reactionId || !_type) {
    throw new ResponseError("Id or type is empty!");
  }
  await CommentsReactions.update({ _reactionId, _type });
  res.send({ status: 200, message: "OK" });
}
export async function DeleteReactions(req: Request, res: Response) {
  const _reactionId = req.params.id as string;
  if (!_reactionId) {
    throw new ResponseError("Id or type is empty!");
  }
  await CommentsReactions.delete({ _reactionId });
  res.send({ status: 200, message: "OK" });
}
