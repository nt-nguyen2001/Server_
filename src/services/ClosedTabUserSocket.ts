import { Socket } from "socket.io";
import io from "../app";
import { DeleteImage } from "../Utils/DeleteImage.Utils";
const ClosedTabUserNameSpace = io.of("/closedTabUser");
import fs from "fs";
import jwt from "jsonwebtoken";
import { payLoad } from "../Utils/VerifyToken.Utils";

function DeleteImages({
  cookies,
  images,
  max,
}: {
  images: string[];
  max: number;
  cookies: string[];
}) {
  //  const images: string[] = socket.data?.images?.urls || [];
  //  const cookies = socket.handshake.headers.cookie?.split(";");
  cookies?.forEach((cookie) => {
    const [name, value] = cookie.split("=");
    if (name.trim() === "accessToken") {
      const token = decodeURIComponent(value).split(" ");
      try {
        const decoded = jwt.verify(
          token?.[1],
          process.env.SECRET_KEY || "ASD"
        ) as payLoad;
        const path = `./src/Uploads/${decoded?._userId}`;
        const isDelete = images.length < max;
        fs.readdir(path, (err, files) => {
          files?.forEach((file, index) => {
            fs.rmdir(`${path}/${file}`, { recursive: true }, (e) => {
              // console.log("root", e);
              fs.rmdir(path, { recursive: true }, (er) => {
                // console.log(er);
              });
            });
            console.log("DELETE: ", file, isDelete);
            if (isDelete) {
              DeleteImage("", file);
            }
          });
        });
      } catch (err) {
        console.log(err);
      }
    }
  });
}

class ClosedTabUserSocket {
  connection(socket: Socket) {
    socket.on("disconnect", async () => {
      console.log("disconnect");
      DeleteImages({
        cookies: socket.handshake.headers.cookie?.split(";") || [],
        images: socket.data?.images?.urls || [],
        max: socket.data?.images?.max || 0,
      });
    });

    // events
    socket.on("images", (payload: { urls: string[]; max: number }) => {
      console.log("PAYLOAD:", payload);
      socket.data["images"] = payload;
    });
    socket.on("leave", async () => {
      DeleteImages({
        cookies: socket.handshake.headers.cookie?.split(";") || [],
        images: socket.data?.images?.urls || [],
        max: socket.data?.images?.max || 0,
      });
    });
  }
}

export { ClosedTabUserNameSpace };
export default new ClosedTabUserSocket();
