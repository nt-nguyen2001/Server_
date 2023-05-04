import { Router } from "express";
import {
  AcceptFriends,
  DeleteInvitation,
  GetFriendStatus,
  MakeFriends,
} from "../Controllers/Friends.controller";
import TCWrapper from "../Utils/TCWrapper.Utils";

const FriendsRouter = Router();

FriendsRouter.get("/api/friends/", TCWrapper(GetFriendStatus))
  .post("/api/friends", TCWrapper(MakeFriends))
  .patch("/api/friends", TCWrapper(AcceptFriends))
  .delete("/api/friends/invitation/:userId/:id", TCWrapper(DeleteInvitation));

export { FriendsRouter };
