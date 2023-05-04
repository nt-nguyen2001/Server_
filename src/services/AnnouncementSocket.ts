import { RemoteSocket, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import io from "../app";
import { Friends } from "../Database/friends.db";
const AnnouncementNameSpace = io.of("/announcement");

interface AnnounceType {
  _userId: string;
  data: Object;
}

interface OnlineStatusPayload {
  avatar: string;
  _name: string;
  _userId: string;
  _userName: string;
  _idFriends: string;
}

function getInstance<T>(instances: Map<string, T>, id1: string, id2: string) {
  if (instances.get(id1)) {
    return { instance: instances.get(id1), friendId: id1 };
  }
  return { instance: instances.get(id2), friendId: id2 };
}
class AnnouncementSocket {
  connection(socket: Socket) {
    socket.on("disconnect", async () => {
      const sockets = await io.of("/announcement").fetchSockets();

      const instances = new Map<
        string,
        RemoteSocket<DefaultEventsMap, any>[]
      >();

      for (const currSocket of sockets) {
        const key = Object.keys(currSocket.data)[0];
        const oldKey = Object.keys(socket.data)[0];
        if (currSocket.data[oldKey]) {
          return;
        }
        if (instances.get(key)) {
          instances.set(key, [currSocket, ...(instances.get(key) ?? [])]);
        } else {
          instances.set(key, [currSocket]);
        }
      }

      socket.data?.friends?.map((key: string) => {
        const { instance } = getInstance<RemoteSocket<DefaultEventsMap, any>[]>(
          instances,
          key,
          ""
        );
        instance?.map((socketInstance) => {
          socketInstance?.emit("offline", Object.keys(socket.data)[0]);
        });
      });
    });

    // events
    socket.on("connected", async (id: string, payload: OnlineStatusPayload) => {
      socket.data[id] = socket.id;
      const res = await Friends.getAll(id);

      const sockets = await io.of("/announcement").fetchSockets();

      const instances = new Map<
        string,
        RemoteSocket<DefaultEventsMap, any>[]
      >();
      let yourInstance: RemoteSocket<DefaultEventsMap, any> | undefined =
        undefined;
      let isExisted = false;
      for (const s of sockets) {
        if (!s.data[id]) {
          const key = Object.keys(s.data)[0];
          if (instances.get(key)) {
            instances.set(key, [s, ...(instances.get(key) ?? [])]);
          } else {
            instances.set(key, [s]);
          }
        } else {
          if (s.data[id] !== socket.id) {
            isExisted = true;
          } else {
            yourInstance = s;
          }
        }
      }
      let friends: OnlineStatusPayload[] = [];
      res?.map((friend) => {
        const { instance, friendId } = getInstance<
          RemoteSocket<DefaultEventsMap, any>[]
        >(instances, friend._UID1, friend._UID2);

        if (instance) {
          socket.data.friends = [
            friend._userId,
            ...(socket.data.friends ?? []),
          ];
          friends = [
            {
              avatar: friend.avatar,
              _name: friend._name,
              _userId: friend._userId,
              _userName: friend._userName,
              _idFriends: friend._idFriends,
            },
            ...friends,
          ];
        }
        if (!isExisted) {
          instance?.map((socketInstance) => {
            socketInstance.emit("online", {
              ...payload,
              _idFriends: friend._idFriends,
            });
          });
        }
      });

      yourInstance?.emit("online", friends);
    });
    socket.on("announce", async (payload: AnnounceType, toId: string) => {
      const sockets = await io.of("/announcement").fetchSockets();
      for (const socket of sockets) {
        if (socket.data[toId]) {
          socket.emit("announce", payload);
          return;
        }
      }
    });
    socket.on("comments", async (payload, id) => {
      const sockets = await io.of("/announcement").fetchSockets();
      for (const socket of sockets) {
        if (socket.data[id]) {
          socket.emit("comments", payload);
        }
      }
    });

    socket.on(
      "messagesNotifications",
      async (payload: {
        toUID: string;
        _idConversations: string;
        _content: string;
      }) => {
        const sockets = await io.of("/announcement").fetchSockets();
        for (const s of sockets) {
          if (s.data[payload?.toUID]) {
            s.emit("messagesNotifications", payload);
            socket.emit("receivedMessagesNotifications", payload);
            return;
          }
        }
      }
    );
    socket.on(
      "receivedMessages",
      async (payload: { toUID: string; _idConversations: string }) => {
        const sockets = await io.of("/announcement").fetchSockets();
        for (const s of sockets) {
          if (s.data[payload?.toUID]) {
            s.emit("receivedMessages", payload);
            return;
          }
        }
      }
    );
  }
}

export { AnnouncementNameSpace };
export default new AnnouncementSocket();
