import { Socket } from "socket.io";
import io from "../../app";
const SignalingNameSpace = io.of("/rtc");

class SignalingClass {
  connection(socket: Socket) {
    const UID = socket.handshake.query.UID as string;
    socket.data["id"] = UID;
    if (UID) {
      socket.join(UID);
    }
    socket.on(
      "makingCallIsFail",
      ({
        toUID,
        ...payload
      }: {
        message: string;
        typeError: "Busy" | "Reject";
        toUID: string;
      }) => {
        // console.log("?");
        socket.to(toUID).emit("makingCallIsFail", payload);
      }
    );
    socket.on(
      "ring",
      ({
        payload,
        toUID,
      }: {
        toUID: string;
        payload: { roomId: string; audio: boolean; video: boolean };
      }) => {
        socket
          .to(toUID)
          .emit("ring", { ...payload, fromUID: socket.data["id"] });
      }
    );

    socket.on("disconnect", async () => {});
  }
}

export { SignalingNameSpace };
export default new SignalingClass();
