import { DB } from ".";
import { IComment } from "../Types/Comment.type";
import { PostProps } from "../Types/Post.type";

const _instance = DB.getInstance();

const Comments = {
  create: async ({
    _parentId = null,
    _toId = null,
    _commentId,
    _content,
    _createAt,
    _postsId,
    _userId,
  }: IComment) => {
    return _instance._query("Insert into comments values(?,?,?,?,?,?,?);", [
      _commentId,
      _postsId,
      new Date(_createAt),
      _content,
      _userId,
      _parentId,
      _toId,
    ]);
  },
  delete: async (id: string) => {
    const comments = await _instance._query<{ _commentId: string }>(
      "Select _commentId from comments where _parentId = ?",
      [id]
    );
    await _instance._query(
      "Delete from comments where _commentId = ? or _parentId = ?;",
      [id, id]
    );
    return comments;
  },
  update: (_commentId: string, _content: string, _to: string | null) => {
    return _instance._query(
      "Update comments set _content = ?, _toId= ? where _commentId = ? ",
      [_content, _to, _commentId]
    );
  },
  // ????
  getByIdPost: (postId: string, parentId: string, offset: string) => {
    if (parentId) {
      return _instance._query<IComment>(
        `Select cmt.*, ( Select u1._name from user as u1 where cmt._toId = u1._userId ) as _toUserName, (Select count(_reactionId) from commentsReactions as cmtR where cmtR._commentId = cmt._commentId) as _numberOfCommentsReactions, ( Select count(*) from comments as C_C where cmt._commentId = C_C._parentId )  as _responseQuantity, (Select _userName from user where cmt._toId = user._userId) as _userNameTag, u.avatar,u._name,u._userName,u._userId from comments as cmt, user as u  where _postsId = ? and cmt._userId = u._userId and _parentId = ? Limit ${offset},5`,
        [postId, parentId]
      );
    }
    return _instance._query<IComment>(
      `Select cmt.*, (select count(*) from comments as C_C where cmt._commentId = C_C._parentId) as _responseQuantity,(Select count(_reactionId) from commentsReactions as cmtR where cmtR._commentId = cmt._commentId) as _numberOfCommentsReactions, u.avatar,u._name,u._userName,u._userId from comments as cmt, user as u  where _postsId = ? and cmt._userId = u._userId and _parentId is NULL Limit ${offset},5`,
      [postId]
    );
  },
};
export default Comments;
