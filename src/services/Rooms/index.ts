import { Socket } from "socket.io";
import io from "../../app";
const RoomsCallNameSpace = io.of("/roomsCall");

type signaling_sdp = {
  sdp: any;
  UID: string;
};
type signaling_ice = {
  ice: RTCIceCandidate;
  UID: string;
};
// "b14e010e-c54e-41bd-bde0-76f9dbc90438";

let rooms = new Map<
  string,
  {
    typeRoom: "P" | "G";
    usersInRoom: string[];
    currentUsersInRoom: string[];
  }
>();

type JoinRoomT = {
  typeRoom: "P" | "G";
  usersInRoom: string[];
  roomId: string;
};

class roomsCallClass {
  connection(socket: Socket) {
    const id = socket.handshake.query.UID as string;
    socket.data["id"] = id;

    socket.join(id);

    socket.on("joinRoom", ({ typeRoom, usersInRoom, roomId }: JoinRoomT) => {
      socket.data["room"] = roomId;
      let room = rooms.get(roomId);
      let usersRing: string[] = [];

      if (room) {
        const type = rooms.get(roomId)?.typeRoom;
        if (type === "G") {
          console.log("call group api");
        } else {
          const usersInRoom = rooms.get(roomId)?.usersInRoom || [];
          const user = usersInRoom?.find((user) => user === socket.data["id"]);

          if (!user) {
            socket.emit("joinRoom", {
              success: false,
              numberOfUsers: 0,
              messageError: "Is there something wrong, plz try again later.",
            });
            return;
          }

          room = {
            ...room,
            currentUsersInRoom: [...room.currentUsersInRoom, socket.data["id"]],
          };
        }
      } else {
        room = {
          typeRoom,
          usersInRoom,
          currentUsersInRoom: [socket.data["id"]],
        };

        let error = 0;
        usersInRoom.forEach((user) => {
          if (user !== socket.data["id"]) {
            if (RoomsCallNameSpace.adapter.rooms.get(user)) {
              error += 1;
              return;
            }
            usersRing.push(user);
          }
        });
        if (error === usersInRoom.length - 1) {
          socket.emit("joinRoom", {
            success: false,
            numberOfUsers: 0,
            messageError: "The user is on another call.",
          });
          return;
        }
      }

      socket.join(roomId);

      socket.emit("joinRoom", {
        success: true,
        currentUsersInRoom: rooms.get(roomId)?.currentUsersInRoom || [],
        messageError: undefined,
        usersRing,
      });

      rooms.set(roomId, room);
    });

    socket.on(
      "signaling_sdp",
      ({ uid, sdp }: { sdp: RTCSessionDescriptionInit; uid: string }) => {
        socket
          .to(uid)
          .emit("signaling_sdp", { sdp, fromUID: socket.data["id"] });
      }
    );
    socket.on(
      "signaling_ice",
      ({ uid, ice }: { ice: RTCIceCandidate; uid: string }) => {
        socket
          .to(uid)
          .emit("signaling_ice", { ice, fromUID: socket.data["id"] });
      }
    );
    socket.on("addPeople", ({ UIDs }: { UIDs: string[] }) => {
      const room = rooms.get(socket.data["room"]);

      if (room) {
        const newUsersInRoom = room.usersInRoom;
        UIDs.map((newU) => {
          const user = newUsersInRoom.find((u) => u === newU);
          if (!user) {
            newUsersInRoom.push(newU);
          }
        });
        rooms.set(socket.data["room"], {
          ...room,
          currentUsersInRoom: newUsersInRoom,
        });
      }
      socket.emit("addPeople", "OK");
    });
    socket.on("disconnect", async () => {
      const oldRoom = rooms.get(socket.data["room"]);
      if (oldRoom) {
        const users = oldRoom?.currentUsersInRoom;
        if (users?.length === 1) {
          rooms.delete(socket.data["room"]);
        } else {
          const newUsers =
            users?.filter((user) => user !== socket.data["id"]) || [];
          socket
            .to(socket.data["room"])
            .emit("userDisconnected", socket.data["id"]);
          rooms.set(socket.data["room"], {
            ...oldRoom,
            currentUsersInRoom: newUsers,
          });
        }
      }
    });
  }
}

export { RoomsCallNameSpace };
const RoomsCallSocket = new roomsCallClass();
export { RoomsCallSocket };
