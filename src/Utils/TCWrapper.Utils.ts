import { NextFunction, Request, Response } from "express";
import { ResponseError } from "./CustomThrowError.Utils";

const TCWrapper =
  (fn: Function) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      const error = err as ResponseError;
      console.log("ERROR::::: ", err);
      res.status(error.error || 500).json({
        status: error.error || 500,
        message: (error.error && error.message) || "Internal server error",
      });
    }
  };

export default TCWrapper;
