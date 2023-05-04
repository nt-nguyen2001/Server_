import cors from "cors";
import "dotenv/config";
import express, { Application } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
const app: Application = express();
const cookieParser = require("cookie-parser");
export const httpServer = createServer(app);

// All api have a risk, because another server can call API without permission. Need fix
const whitelist = [
  "https://basic-social-network.onrender.com",
  "http://localhost:3000",
];

const io = new Server(httpServer, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  },
});

export default io;

import { route } from "./Routes";
import AnnouncementSocket, {
  AnnouncementNameSpace,
} from "./services/AnnouncementSocket";
import ClosedTabUserSocket, {
  ClosedTabUserNameSpace,
} from "./services/ClosedTabUserSocket";
import { RoomsCallNameSpace, RoomsCallSocket } from "./services/Rooms";
import SignalingSocket, {
  SignalingNameSpace,
} from "./services/Rooms/SignalingSocket";

app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    // methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    credentials: true,
  })
);

AnnouncementNameSpace.on("connection", AnnouncementSocket.connection);
ClosedTabUserNameSpace.on("connection", ClosedTabUserSocket.connection);
SignalingNameSpace.on("connection", SignalingSocket.connection);
RoomsCallNameSpace.on("connection", RoomsCallSocket.connection);

route(app);

// built-in error handler that takes care of any errors that might be encountered in the app.
// can't catch  a Promise rejection outside of an async function
//https://stackoverflow.com/questions/51391080/handling-errors-in-express-async-middleware
// ####### NEW UPDATE with expressJS 5 route handlers and middleware that return a Promise will call next(value) automatically when they reject or throw an error
// app.use(
//   (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
//     console.log(err);
//     res.status(err.status || 500).json({
//       status: err.status || 500,
//       message: (err.status || "Internal server error") && err.message,
//     });
//   }
// );

httpServer.listen(process.env.PORT || 3000, () => {
  console.log(`App listening on port ${process.env.PORT || 3000}`);
});
