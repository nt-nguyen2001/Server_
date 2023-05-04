import { Router } from "express";
import {
  CheckUserExists,
  login,
  logOut,
  register,
  VerifyLogin,
} from "../Controllers/Authentication.controller";
import assignToken from "../Middleware/AssignToken.Middleware";
import TCWrapper from "../Utils/TCWrapper.Utils";
import { VerifyRefreshToken } from "../Utils/VerifyRefreshToken";

const router = Router();

router
  .get("/api/auth/verifyLogin", TCWrapper(VerifyLogin))
  .get(
    "/api/auth/refreshToken",
    TCWrapper(VerifyRefreshToken),
    TCWrapper(assignToken)
  )
  .get("/api/auth/userExists/:slug", TCWrapper(CheckUserExists))
  .get("/api/auth/LogOut", TCWrapper(logOut))
  .post(
    "/api/auth/login",
    TCWrapper(login),
    // TCWrapper(assignRefreshToken),
    TCWrapper(assignToken)
  )
  .post("/api/auth/register", TCWrapper(register));
export default router;
