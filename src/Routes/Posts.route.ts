import { NextFunction, Request, Response, Router } from "express";
import {
  createPosts,
  deletePosts,
  GetNumberOfPosts,
  getPosts,
  getPostsByPostId,
  getPostsByUserName,
  updatePosts,
  UploadImages,
} from "../Controllers/Posts.controller";
import { upload } from "../services/Multer";
import TCWrapper from "../Utils/TCWrapper.Utils";
const router = Router();

router
  .get("/api/posts/", TCWrapper(getPosts))
  .get("/api/posts/userName/:id/:viewerId", TCWrapper(getPostsByUserName))
  .get("/api/posts/quantity/user/:id", TCWrapper(GetNumberOfPosts))
  .get("/api/posts/:id/", TCWrapper(getPostsByPostId))
  .patch("/api/posts", TCWrapper(updatePosts))
  .delete("/api/posts/", TCWrapper(deletePosts))
  .post(
    "/api/posts/images",
    (req: Request, res: Response, next: NextFunction) => {
      // console.log(req.cookies);
      // Verify here.
      next();
    },
    upload.array("images"),
    TCWrapper(UploadImages)
  )
  .post("/api/posts", TCWrapper(createPosts));
export default router;
