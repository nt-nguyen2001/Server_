export interface IComment {
  _commentId: string;
  _postsId: string;
  _createAt: number | string | Date;
  _content: string;
  _userId: string;
  _parentId?: string | null;
  _toId?: string | null;
}
