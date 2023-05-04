import { Request, Response } from "express";
import { PostReactions } from "../Database/postReactions.db";
import { PostsReactionsProps } from "../Types/reaction.type";
import { ResponseError } from "../Utils/CustomThrowError.Utils";

export async function CreateReactions(req: Request, res: Response) {
  const payload = req.body.payload as PostsReactionsProps;
  if (!payload) {
    throw new ResponseError("Payload is empty!");
  }
  await PostReactions.create(payload);
  res.send({ status: 200, message: "OK" });
}
export async function GetReactions(req: Request, res: Response) {
  const _postId = req.params.id as string;
  if (!_postId) {
    throw new ResponseError("Id is empty!");
  }
  const [reactions, topReactions] = await PostReactions.get({ _postId });
  res.send({
    status: 200,
    message: "OK",
    payload: {
      reactions,
      topReactions,
    },
  });
}
export async function UpdateReactions(req: Request, res: Response) {
  const _reactionId = req.params.id as string;
  const _type = req.body.payload as string;
  if (!_reactionId || !_type) {
    throw new ResponseError("Id or type is empty!");
  }
  await PostReactions.update({ _reactionId, _type });
  res.send({ status: 200, message: "OK" });
}
export async function DeleteReactions(req: Request, res: Response) {
  const _reactionId = req.params.id as string;
  if (!_reactionId) {
    throw new ResponseError("Id or type is empty!");
  }
  await PostReactions.delete({ _reactionId });
  res.send({ status: 200, message: "OK" });
}
