import { Request, Response } from "express";
import Announcement from "../Database/announcement.database";
import Comments from "../Database/comments.database";
import { CommentsReactions } from "../Database/commentsReactions.db";
import { IComment } from "../Types/Comment.type";
import { ResponseError } from "../Utils/CustomThrowError.Utils";

export async function createComments(req: Request, res: Response) {
  const comment = (req.body?.payload as IComment) || {
    _commentId: "",
    _content: "",
    _createAt: "",
    _postsId: "",
    _userId: "",
    _parentId: null,
    _toId: null,
  };
  await Comments.create(comment);
  res.send({ status: 200, message: "OK" });
}
export async function getComments(req: Request, res: Response) {
  const postId = req.params.postId;
  const parentId = req.query.parentId as string;
  const offset = (req.query.offset as string) || "0";
  const _userId = req.query.userId as string;
  if (!postId || !_userId) {
    throw new ResponseError("Id is empty!");
  }
  const payload = await Comments.getByIdPost(postId, parentId, offset);

  const newPayload = await Promise.all(
    payload?.map(async (comment) => {
      const [type_reaction_viewer, topReactions] = await CommentsReactions.get({
        _commentId: comment._commentId,
        _userId,
      });
      return {
        ...comment,
        topReactions: topReactions,
        type_reaction_viewer: type_reaction_viewer?.[0]?.type_reaction_viewer,
        reactionId_viewer: type_reaction_viewer?.[0]?.reactionId_viewer,
      };
    })
  );

  res.send({ status: 200, message: "OK", payload: newPayload });
}
// export async function getNumberOfComments(params: type) {}
export async function deleteComments(req: Request, res: Response) {
  const commentId = req.params.id;
  const userId = req.query.id as string;
  if (!commentId) {
    throw new ResponseError("Id is empty!");
  }
  const comments = await Comments.delete(commentId);
  for (const id of comments) {
    const idReactions = await CommentsReactions.deleteByCommentId({
      _commentId: id._commentId,
    });
    await Announcement.deleteByIdOther({ _idOther: idReactions, userId });
    await Announcement.deleteByIdOther({ _idOther: id._commentId, userId });
  }
  res.send({ status: 200, message: "OK" });
}
export async function editComments(req: Request, res: Response) {
  const commentId = req.params.id;
  const {
    _commentId = "",
    _content = "",
    _toId = "",
  }: Required<IComment> = req.body.payload || {
    _commentId: "",
    _content: "",
    _to: "",
  };

  if (!commentId) {
    throw new ResponseError("Id is empty!");
  }
  await Comments.update(commentId, _content, _toId);
  res.send({ status: 200, message: "OK" });
}
