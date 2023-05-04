import { Router } from "express";
import {
  createComments,
  deleteComments,
  editComments,
  getComments,
  // getComments,
  // getRespondedComments,
  // replyToComments,
} from "../Controllers/Comment.controller";
import TCWrapper from "../Utils/TCWrapper.Utils";
const router = Router();

router
  .post("/api/comments/", TCWrapper(createComments))
  .delete("/api/comments/:id", TCWrapper(deleteComments))
  .patch("/api/comments/:id", TCWrapper(editComments))
  // .get("/api/comments/quantities",)
  .get("/api/comments/:postId/", TCWrapper(getComments));
// .get("/api/comments/:postId/:parentId", TCWrapper(getComments));
// .post("/api/comments/response", TCWrapper(replyToComments))
// .get("/api/comments/:id/:depth", TCWrapper(getComments));
export default router;
