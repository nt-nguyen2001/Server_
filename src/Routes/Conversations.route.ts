import { Router } from "express";
import {
  CreateConverSations,
  DeleteMessages,
  GetConversationsById,
  GetConversationsByUID,
  UpdateConversationsState,
} from "../Controllers/Conversations.controller";

import TCWrapper from "../Utils/TCWrapper.Utils";

const ConversationsRouter = Router();

ConversationsRouter.get(
  "/api/conversations/:id",
  TCWrapper(GetConversationsById)
)
  .get("/api/conversations/UID/:id", TCWrapper(GetConversationsByUID))
  .post("/api/conversations", TCWrapper(CreateConverSations))
  .delete("/api/conversations/messages/:id", TCWrapper(DeleteMessages))
  .patch("/api/conversations/:id/state/", TCWrapper(UpdateConversationsState));

export { ConversationsRouter };
