import { DB } from ".";
import { TUser } from "../Types";
import { Post } from "../Types/Post.type";
import { DeleteImage } from "../Utils/DeleteImage.Utils";
import User from "./user.database";

const _instance = DB.getInstance();

enum TypeReactions {
  "Like" = 1,
  "Wow",
  "Angry",
  "Sad",
  "Haha",
  "Love",
  "Care",
}

type PostsT = {
  numberOfComments: number;
  currentComments: number;

  _images: string[];
  _postsId: string;
  _userId: string;
  _createAt: string;
  _content: string;
  _userName: string;
  _name: string;
  avatar: string;

  viewer_actor: string;
  type_reaction: string;
  reactionId: string;
  numberOfReactions: number;
};

const Posts = {
  create: async ({
    _images,
    _content,
    _createAt,
    _postsId,
    _userId,
  }: Post & { _images: string[][] }) => {
    if (_images?.length) {
      await _instance._query("Insert into posts_image values ?", [_images]);
    }
    return _instance._query("Insert into posts values(?,?,?,?);", [
      _postsId,
      _userId,
      new Date(_createAt),
      _content,
    ]);
  },
  delete: async (id: string) => {
    const urls = await _instance._execute<{ url: string }>(
      "Select _images as url from posts_image where _postsId = ?",
      [id]
    );
    if (urls.length && urls[0].url) {
      const regex = /.*(?=(.jpg)$|(.png)$|(.jpeg)$)/g;
      const urlImage = urls[0].url.match(regex)?.[0];
      const urlSplit = urlImage?.split("/");
      DeleteImage("", urlSplit?.[urlSplit.length - 2]);
    }
    const task1 = _instance._execute("Delete from posts where _postsId = ?", [
      id,
    ]);
    const task2 = _instance._execute(
      "Delete from posts_image where _postsId = ?",
      [id]
    );
    const task3 = _instance._execute(
      "Delete from comments where _postsId = ?",
      [id]
    );
    return Promise.all([task1, task2, task3]);
  },
  updateImage: async (
    newImages: string[][],
    dirtyImages: string[],
    id: string
  ) => {
    if (dirtyImages.length) {
      const empty = await _instance._query(
        "Select * from posts_image where _images not in (?) and _postsId = ?",
        [dirtyImages, id]
      );
      console.log("image dirty: ", empty);
      if (empty.length) {
        dirtyImages.map((image) => {
          DeleteImage(image);
        });
      } else {
        const regex = /.*(?=(.jpg)$|(.png)$|(.jpeg)$)/g;
        const urlImage = dirtyImages[0].match(regex)?.[0];
        const urlSplit = urlImage?.split("/");
        DeleteImage("", urlSplit?.[urlSplit?.length - 2]);
      }
      await _instance._query(
        "Delete from posts_image where _images in (?) and _postsId = ?",
        [dirtyImages, id]
      );
    }
    if (newImages.length) {
      return _instance._query("Insert into posts_image values ?", [newImages]);
    }
  },
  updatePosts: async (keys: string[], value: string[], id: string) => {
    const query = keys.join(" = ?, ") + ` = ?`;
    return _instance._query(`Update posts set ${query} where _postsId = ?`, [
      ...value,
      id,
    ]);
  },
  getByUserId: async (
    id: string,
    viewerId: string,
    offset: string = "0",
    limit: string = "5"
  ) => {
    const task1 = await User.getByUserName(id);
    const { _userId } = task1?.[0] ?? { _userId: "" };
    const _numberOfPosts = await _instance._execute<{ _numberOfPosts: number }>(
      "Select count(_postsId) as _numberOfPosts from posts where _userId = ?",
      [_userId]
    );

    const task2 = await _instance._query<
      Omit<Post, "cmtQuantity" | "_like"> & {
        _userName: string;
        viewer_actor: string;
        type_reaction: string;
        reactionId: string;
        numberOfComments: number;
        numberOfReactions: number;
        currentComments: number;
      }
    >(
      `Select p.*, u._userName , r2._fromUserId as viewer_actor, r2._type as type_reaction,r2._reactionId as reactionId, (Select count(c._commentId) from comments as c where c._postsId =  p._postsId) as numberOfComments, (Select count(r._reactionId) from postReactions as r where r._postId = p._postsId) as numberOfReactions,(Select count(c._commentId) from comments as c where c._postsId =  p._postsId and c._parentId is Null) as currentComments from posts as p left join user as u on u._userId = p._userId left join postReactions as r2 on r2._postId = p._postsId and r2._fromUserId = ? where p._userId = ? order by _createAt DESC limit ${offset},${limit}`,
      [viewerId, _userId]
    );

    const postsId = task2.map((post) => {
      return post._postsId;
    });

    let i = {
      id: "",
      index: -1,
    };
    const newPosts: PostsT[] = task2.map((post) => {
      return {
        ...post,
        _name: task1?.[0]._name || "",
        avatar: task1?.[0].avatar || "",
        _images: [],
      };
    });

    if (postsId.length) {
      const images = await _instance._query<{
        _postsId: string;
        _images: string;
      }>("select * from posts_image where _postsId IN (?)", [postsId]);

      images.forEach((image) => {
        if (i.id !== image._postsId) {
          i.index = task2.findIndex((item) => item._postsId === image._postsId);
          i.id = image._postsId;
          newPosts[i.index]._images = [
            image._images,
            ...newPosts[i.index]._images,
          ];
        } else {
          newPosts[i.index]._images = [
            image._images,
            ...newPosts[i.index]._images,
          ];
        }
      });
    }

    return {
      posts: newPosts,
      _numberOfPosts: _numberOfPosts[0]._numberOfPosts,
    };
  },
  // ??
  getByPostId: (postId: string, viewerId: string) => {
    // const task1 = User.getByUserName(userName);

    return _instance._query<Post>(
      "Select p.*, u._userName,u._name, u.avatar, u._userId, i._images, r2._fromUserId as viewer_actor, r2._type as type_reaction,r2._reactionId as reactionId, (Select count(c._commentId) from comments as c where c._postsId =  p._postsId) as numberOfComments, (Select count(r._reactionId) from postReactions as r where r._postId = p._postsId) as numberOfReactions,(Select count(c._commentId) from comments as c where c._postsId =  p._postsId and c._parentId is Null) as currentComments from posts as p left join user as u on u._userId = p._userId left join posts_image as i on p._postsId = i._postsId left join postReactions as r2 on r2._postId = p._postsId and r2._fromUserId = ? where p._postsId = ?  order by _createAt DESC",
      [viewerId, postId]
    );
  },
  getPosts: async (
    _userId: string,
    offset: string = "0",
    limit: string = "5"
  ) => {
    const _numberOfPosts = await _instance._execute<{ _numberOfPosts: number }>(
      "Select count(_postsId) as _numberOfPosts from posts "
    );
    const task2 = await _instance._query<
      Omit<Post, "cmtQuantity" | "_like"> & {
        _userName: string;
        viewer_actor: string;
        type_reaction: string;
        reactionId: string;
        numberOfComments: number;
        numberOfReactions: number;
        currentComments: number;
        _name: string;
        avatar: string;
        _userId: string;
      }
    >(
      `Select p.*, u._userName,u._name, u.avatar, u._userId , r2._fromUserId as viewer_actor, r2._type as type_reaction,r2._reactionId as reactionId, (Select count(c._commentId) from comments as c where c._postsId =  p._postsId) as numberOfComments, (Select count(r._reactionId) from postReactions as r where r._postId = p._postsId) as numberOfReactions, (Select count(c._commentId) from comments as c where c._postsId =  p._postsId and c._parentId is Null) as currentComments from posts as p left join user as u on u._userId = p._userId left join postReactions as r2 on r2._postId = p._postsId and r2._fromUserId = ? order by _createAt DESC limit ${offset},${limit}`,
      [_userId]
    );

    const postsId = task2.map((post) => {
      return post._postsId;
    });
    let i = {
      id: "",
      index: -1,
    };
    const newPosts: PostsT[] = task2.map((post) => {
      return {
        ...post,
        _images: [],
      };
    });
    if (postsId.length) {
      const images = await _instance._query<{
        _postsId: string;
        _images: string;
      }>("select * from posts_image where _postsId IN (?)", [postsId]);
      images.forEach((image) => {
        if (i.id !== image._postsId) {
          i.index = task2.findIndex((item) => item._postsId === image._postsId);
          i.id = image._postsId;
          newPosts[i.index]._images = [
            image._images,
            ...newPosts[i.index]._images,
          ];
        } else {
          newPosts[i.index]._images = [
            image._images,
            ...newPosts[i.index]._images,
          ];
        }
      });
    }

    return {
      posts: newPosts,
      _numberOfPosts: _numberOfPosts?.[0]?._numberOfPosts,
    };
  },
  async getNumberOfPosts({ _userId }: Pick<TUser, "_userId">) {
    const res = await _instance._query<{ quantity: number }>(
      "Select count(_userId) as quantity from posts where _userId = ?",
      [_userId]
    );
    return res?.[0]?.quantity;
  },
};
export default Posts;
