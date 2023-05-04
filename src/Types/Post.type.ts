export interface Post {
  // _postsId: string;
  // _createAt: Date;
  // _content: string;
  // _like: number;
  // _userName: string;
  // _images?: string[][];
  // cmtQuantity: string | number;
  _postsId: string;
  _userId: string;
  _createAt: string;
  _content: string;
  _like: string | number;
  cmtQuantity: number | string;
}

export interface PostProps extends Post {
  _images: string[];
}
