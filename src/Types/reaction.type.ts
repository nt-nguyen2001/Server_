export interface PostsReactionsProps {
  _reactionId: string;
  _fromUserId: string;
  _type: string;
  _postId: string;
}

export interface CommentsReactionsProps extends PostsReactionsProps {
  _commentId: string;
}
