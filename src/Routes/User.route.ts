import { Router } from "express";
import { GetInfoFriends } from "../Controllers/Friends.controller";
import {
  CheckExistedUserName,
  deleteImage,
  getUserByAccount,
  getUserByUserName,
  getUsers,
  getUsersById,
  UpdateInfoUser,
  updateUser,
  ChangePass,
  SearchUserByName,
} from "../Controllers/Users.Controller";
import verifyToken from "../Middleware/VerifyToken.Middleware";
import TCWrapper from "../Utils/TCWrapper.Utils";

const router = Router();

router
  .get(
    "/api/users/account",
    TCWrapper(verifyToken("0")),
    TCWrapper(getUserByAccount)
  )
  .get(
    "/api/users/id",
    TCWrapper(verifyToken("0")),
    TCWrapper(getUserByUserName)
  )
  .get("/api/users", TCWrapper(verifyToken("0")), TCWrapper(getUsers))
  .get("/api/users/id/:id", TCWrapper(getUsersById))
  .get("/api/users/:userName", TCWrapper(getUserByUserName))
  .get("/api/users/:id/infoFriends", TCWrapper(GetInfoFriends))
  .get("/api/users/userName/:id", TCWrapper(CheckExistedUserName))
  .get("/api/users/search/:userName", TCWrapper(SearchUserByName))
  .post("/api/users/id/:id/verifyPassword", TCWrapper(ChangePass))
  .delete("/api/users/image/:id", deleteImage)
  .patch("/api/users/info", TCWrapper(UpdateInfoUser))
  .patch("/api/users/:id/", TCWrapper(updateUser));

export default router;
