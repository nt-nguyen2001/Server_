import { DB } from ".";
import { PostsReactionsProps } from "../Types/reaction.type";

const _instance = DB.getInstance();

const PostReactions = {
  create({ _fromUserId, _postId, _reactionId, _type }: PostsReactionsProps) {
    return _instance._query("Insert into postReactions values(?,?,?,?)", [
      _postId,
      _reactionId,
      _type,
      _fromUserId,
    ]);
  },
  async get({ _postId }: Pick<PostsReactionsProps, "_postId">) {
    const reactions = _instance._query(
      "select r.*, u.avatar, u._name from postReactions as r left join user as u on r._fromUserId = u._userId where r._postId = ?",
      [_postId]
    );
    const topReactions = _instance._query(
      "Select count(_type) as quantity,_type from postReactions where _postId = ? group by _type order by quantity desc limit 3 ",
      [_postId]
    );
    return await Promise.all([reactions, topReactions]);
  },
  update({
    _reactionId,
    _type,
  }: Pick<PostsReactionsProps, "_reactionId" | "_type">) {
    return _instance._query(
      "Update postReactions set _type = ? where _reactionId = ?",
      [_type, _reactionId]
    );
  },
  delete({ _reactionId }: Pick<PostsReactionsProps, "_reactionId">) {
    return _instance._query("Delete from postReactions where _reactionId = ?", [
      _reactionId,
    ]);
  },
  deleteByPostId({ _postId }: Pick<PostsReactionsProps, "_postId">) {
    return _instance._query("Delete from postReactions where _postId = ? ", [
      _postId,
    ]);
  },
  // delete({_postId}:Pick<ReactionsProps,"_postId">){

  // }
};
export { PostReactions };
