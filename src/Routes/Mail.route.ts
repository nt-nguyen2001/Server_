import { Router } from "express";
import { mailRegister } from "../Controllers/Mail.Controller";
import TCWrapper from "../Utils/TCWrapper.Utils";
const router = Router();

router
  .post("/api/email/register", TCWrapper(mailRegister))
  .post("/api/email/forgotPassword");
export default router;
