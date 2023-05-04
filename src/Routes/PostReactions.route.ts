import { Router } from "express";
import {
  CreateReactions,
  DeleteReactions,
  GetReactions,
  UpdateReactions,
} from "../Controllers/PostsReactions.controller";
import TCWrapper from "../Utils/TCWrapper.Utils";
const router = Router();

router
  .get("/api/reactions/posts/:id", TCWrapper(GetReactions))
  .post("/api/reactions/posts", TCWrapper(CreateReactions))
  .patch("/api/reactions/posts/:id", TCWrapper(UpdateReactions))
  .delete("/api/reactions/posts/:id", TCWrapper(DeleteReactions));
export default router;
