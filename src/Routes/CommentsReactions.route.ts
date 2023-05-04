import { Router } from "express";
import {
  CreateReactions,
  DeleteReactions,
  GetReactions,
  UpdateReactions,
} from "../Controllers/CommentsReactions.controller";
import TCWrapper from "../Utils/TCWrapper.Utils";
const router = Router();

router
  .get("/api/reactions/comments/:id", TCWrapper(GetReactions))
  .post("/api/reactions/comments/", TCWrapper(CreateReactions))
  .patch("/api/reactions/comments/:id", TCWrapper(UpdateReactions))
  .delete("/api/reactions/comments/:id", TCWrapper(DeleteReactions));
export default router;
