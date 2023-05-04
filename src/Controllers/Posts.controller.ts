import { Request, Response } from "express";
import Announcement from "../Database/announcement.database";
import Posts from "../Database/posts.database";
import { PostReactions } from "../Database/postReactions.db";
import { Post, PostProps } from "../Types/Post.type";
import { ResponseError } from "../Utils/CustomThrowError.Utils";
import { CommentsReactions } from "../Database/commentsReactions.db";
import { Cloudinary } from "../services/Cloudinary";

export async function createPosts(req: Request, res: Response) {
  const payload: PostProps = req.body.payload;

  if (payload) {
    const newPost = {
      ...payload,
      _images: payload._images?.map((image) => [payload._postsId, image]),
    };
    await Posts.create(newPost);
    res.send({ status: 200, message: "OK" });
  } else {
    throw new ResponseError("payload is empty!", 400);
  }
}
export async function getPostsByUserName(req: Request, res: Response) {
  const id = req.params.id;
  const viewerId = req.params.viewerId;
  const offset = req.query.offset as string;
  const limit = req.query.limit as string;
  const payload = await Posts.getByUserId(id, viewerId, offset, limit);

  setTimeout(() => {
    res.send({ status: 200, message: "OK", payload });
  }, 3000);
}
export async function getPostsByPostId(req: Request, res: Response) {
  const postId = req.params.id;
  const viewer_actor = req.query.viewer_actor as string;

  const payload = await Posts.getByPostId(postId, viewer_actor);

  res.send({ status: 200, message: "OK", payload });
}
export async function getPosts(req: Request, res: Response) {
  const _userId = req.query.id as string;
  const offset = req.query.offset as string;
  const limit = req.query.limit as string;

  if (!_userId) {
    throw new ResponseError("Id is empty!");
  }
  const { _numberOfPosts, posts } = await Posts.getPosts(
    _userId,
    offset,
    limit
  );

  res.send({
    status: 200,
    message: "OK",
    payload: { _numberOfPosts, posts },
  });
}
export async function deletePosts(req: Request, res: Response) {
  const id = req.query.id;
  if (typeof id === "string") {
    const task1 = Posts.delete(id);
    const task2 = Announcement.deleteByIdLink(id);
    const task3 = PostReactions.deleteByPostId({ _postId: id });
    const task4 = CommentsReactions.deleteByPostId(id);
    await Promise.all([task1, task2, task3, task4]);
  } else {
    throw new ResponseError("Typeof query is wrong or empty!", 400);
  }
  res.send({ status: 200, message: "OK", payload: { id } });
}
export async function updatePosts(req: Request, res: Response) {
  const newImages: string[][] = req.body.payload.newImages;
  const dirtyImages: string[] = req.body.payload.dirtyImages;
  const _content: string = req.body.payload.content;
  const id = req.body.payload.id;
  const _userName = req.body.payload._userName;

  await Posts.updateImage(newImages, dirtyImages, id);
  await Posts.updatePosts(["_content"], [_content], id);
  // const [users, posts] = await Posts.getByPostId(id, _userName);
  // const { avatar = "", _name = "", background_img = "" } = users[0];
  // const payload = {
  //   user: {
  //     avatar,
  //     _name,
  //     _userName,
  //     background_img,
  //   },
  //   posts,
  // };

  res.send({ status: 200, message: "OK" });
}

export async function GetNumberOfPosts(req: Request, res: Response) {
  const _userId = req.params.id as string;

  if (!_userId) {
    throw new ResponseError("userId is empty");
  }
  const quantity = await Posts.getNumberOfPosts({ _userId });
  res.send({ status: 400, message: "OK", payload: { quantity } });
}

// export async function getPosts(req: Request, res: Response) {
//   const _instance = DB.getInstance();
//   const rows = await _instance._execute<Posts>(
//     "Select u.avatar, u._userId, u._userName, u.avatar, p._postsId, p._createAt, p._content, p._like, p_i._images From  (select * from user where _userId = ?) as u, Posts as p left join Posts_Image as p_i on p._postsId = p_i._postsId where p._userId = ? order by p._createAt DESC",
//     [req.params.slug || "", req.params.slug || ""]
//   );
//   const newRows = rows.reduce<Posts[]>((previousRow, currentRow) => {
//     const previous = previousRow[previousRow.length - 1];
//     if (previous?._postsId === currentRow?._postsId) {
//       previous._images = [...previous._images, currentRow._images as string];
//       return [...previousRow] as Posts[];
//     }
//     currentRow._images = currentRow._images
//       ? [currentRow._images as string]
//       : [];
//     return [...previousRow, currentRow];
//   }, []);
//   res.status(200).json({ payload: newRows });
// }
// export async function getPost(req: Request, res: Response) {
//   const _instance = DB.getInstance();
//   const rows = await _instance._execute<Posts>(
//     "Select u.avatar, u._userId, u._userName, u.avatar, p._postsId, p._createAt, p._content, p._like, p_i._images From  (select * from user where _userId = ?) as u, Posts as p, posts_Image as p_i where p._userId = ? and p_i._postsId = ?  and p._postsId = p_i._postsId",
//     [req.params.idUser || "", req.params.idUser || "", req.params.idPost || ""]
//   );

//   const newRows = rows.reduce<Posts[]>((previousRow, currentRow) => {
//     const previous = previousRow[previousRow.length - 1];
//     if (previous?._postsId === currentRow?._postsId) {
//       previous._images = [...previous._images, currentRow._images as string];
//       return [...previousRow] as Posts[];
//     }
//     currentRow._images = [currentRow._images as string];
//     return [...previousRow, currentRow];
//   }, []);
//   res.status(200).json({ status: 200, message: "OK", payload: newRows });
// }
// export async function updatePost(req: Request, res: Response) {
//   const {
//     _content = "",
//     _images = "",
//     _postsId = "",
//   }: Posts = req.body.payload;
//   const _instance = DB.getInstance();

//   let deletedImages;
//   let sqlSelect = `Select _images from Posts_Image where _postsId = ? and _images NOT IN (?)`;
//   let sqlDelete =
//     "Delete from Posts_Image where _postsId = ? and _images NOT IN (?)";
//   let sqlUpdate =
//     "Update Posts set _content = ? where _postsId = ?; Insert Ignore into Posts_image values ?";
//   let params: any[] = [_postsId, _images];
//   const images =
//     Array.isArray(_images) && _images.map((image, index) => [_postsId, image]);
//   let paramsUpdate: any[] = [_content, _postsId, images];

//   if (_images.length === 0) {
//     sqlSelect = "Select _images from Posts_Image where _postsId = ? ";
//     params = [_postsId];
//     sqlDelete = `Delete from Posts_Image where _postsId = ?`;
//     sqlUpdate = "Update Posts set _content = ? where _postsId = ?;";
//   }
//   deletedImages = await _instance._query<{
//     _images: string;
//   }>(`${sqlSelect}`, [...params]);
//   deletedImages.map(({ _images }) => {
//     if (_images) {
//       DeleteImage(_images);
//     }
//   });
//   await _instance._query(`${sqlDelete}`, [...params]);
//   await _instance._query(`${sqlUpdate}`, [...paramsUpdate]);
//   res.status(200).json({ status: 200, message: "OK" });
// }
// export async function deletePosts(req: Request, res: Response) {
//   const _instance = DB.getInstance();
//   const task1 = _instance._query("Delete from Posts where _postsId = ?", [
//     req.params.id || "",
//   ]);
//   const images = _instance._query<{ image: string }>(
//     "Select _images as image from Posts_Image where _postsId = ? ",
//     [req.params.id || ""]
//   );
//   (await images).map(({ image }) => {
//     DeleteImage(image);
//   });
//   const task2 = _instance._query("Delete from Posts_Image where _postsId = ?", [
//     req.params.id || "",
//   ]);

//   await Promise.all([task1, task2]);

//   res.status(200).send({ status: 200, message: "OK" });
// }

export async function UploadImages(req: Request, res: Response) {
  const uploader = async (path: string, folder?: string) =>
    await Cloudinary.uploads(path, folder);
  const urls: string[] = [];
  const folder = req.body.id;
  const files = req.files as [];
  console.log("file: ", files.length);
  for (const file of files) {
    const { path } = file;
    const newPath = await uploader(path, folder);
    console.log("push");
    if (newPath.url) {
      urls.push(newPath.url);
    }
  }
  console.log("wtf?");
  if (urls.length === files.length) {
    console.log(urls);
    res.send({ urls });
  }
}
