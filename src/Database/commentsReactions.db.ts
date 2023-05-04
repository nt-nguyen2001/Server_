import { DB } from ".";
import { CommentsReactionsProps } from "../Types/reaction.type";

const _instance = DB.getInstance();

const CommentsReactions = {
  create({
    _fromUserId,
    _commentId,
    _reactionId,
    _type,
    _postId,
  }: CommentsReactionsProps) {
    return _instance._query("Insert into commentsReactions values(?,?,?,?,?)", [
      _commentId,
      _reactionId,
      _type,
      _fromUserId,
      _postId,
    ]);
  },
  get({
    _commentId,
    _userId,
  }: Pick<CommentsReactionsProps, "_commentId"> & { _userId: string }) {
    const type_reaction_viewer = _instance._query(
      "Select cmtR._type  as type_reaction_viewer, cmtR._reactionId as reactionId_viewer from commentsReactions as cmtR where cmtR._fromUserId = ? and cmtR._commentId = ? ",
      [_userId, _commentId]
    );
    const topReactions = _instance._query(
      "Select count(cmtR2._type) as quantity,cmtR2._type from commentsReactions as cmtR2 where _commentId = ? group by cmtR2._type order by quantity desc ",
      [_commentId]
    );
    return Promise.all<any[]>([type_reaction_viewer, topReactions]);
  },
  update({
    _reactionId,
    _type,
  }: Pick<CommentsReactionsProps, "_reactionId" | "_type">) {
    return _instance._query(
      "Update commentsReactions set _type = ? where _reactionId = ?",
      [_type, _reactionId]
    );
  },
  async delete({ _reactionId }: Pick<CommentsReactionsProps, "_reactionId">) {
    return _instance._query(
      "Delete from commentsReactions where _reactionId = ?",
      [_reactionId]
    );
  },
  async deleteByCommentId({
    _commentId,
  }: Pick<CommentsReactionsProps, "_commentId">) {
    const id = await _instance._query<any>(
      "Select _reactionId from commentsReactions where _commentId = ?",
      [_commentId]
    );
    await _instance._query(
      "Delete from commentsReactions where _commentId = ? ",
      [_commentId]
    );
    return id?.[0]?._reactionId || "";
  },
  deleteByPostId(id: string) {
    return _instance._query(
      "Delete from commentsReactions where _postId = ? ",
      [id]
    );
  },
};
export { CommentsReactions };
