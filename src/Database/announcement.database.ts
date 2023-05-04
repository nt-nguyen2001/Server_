import { DB } from ".";
import { AnnouncementData } from "../Controllers/Announcement.controller";

interface AnnouncementI {
  create: (data: AnnouncementData) => void;
  createAnnouncements: ({ _userId }: { _userId: string }) => void;
  getDetailedAnnouncements: ({ _userId }: { _userId: string }) => void;
  getAnnouncements: ({
    _userId,
  }: {
    _userId: string;
  }) => Promise<{ quantity: string }[]>;
  deleteByIdLink: (postId: string) => void;
  deleteByIdAnnouncement: (idAnnouncement: string, userId: string) => void;
  deleteByIdOther: (props: { _idOther: string; userId: string }) => void;
  ReadAnnouncements: (idAnnouncement: string) => void;
  CheckAnnouncements: ({ _userId }: { _userId: string }) => void;
  UpdateAnnouncements: ({ _userId }: { _userId: string }) => void;
}

const __instance = DB.getInstance();
const Announcement: AnnouncementI = {
  create(data) {
    const {
      _fromUser,
      _idAnnouncement,
      _type,
      _userId,
      state,
      _idOther,
      _createAt,
      _idLink,
      _typeLink,
    } = data;
    return __instance._query(
      "Insert into detailedAnnouncement values(?,?,?,?,?,?,?,?,?)",
      [
        _idAnnouncement,
        _userId,
        _idLink,
        _type,
        state,
        _fromUser,
        new Date(_createAt),
        _idOther,
        _typeLink,
      ]
    );
  },
  createAnnouncements({ _userId }) {
    return __instance._query("Insert into announcements values(?,?)", [
      _userId,
      0,
    ]);
  },
  getAnnouncements({ _userId }) {
    return __instance._query(
      "Select quantity from announcements where _userId = ?",
      [_userId]
    );
  },
  getDetailedAnnouncements({ _userId }) {
    return __instance._query(
      "Select Ann.*,u.avatar, u._name, (Select _userName from user as u1 where u1._userId = Ann._userId) as _toUserName from detailedAnnouncement as Ann, user as u where Ann._userId = ? and u._userId = Ann._fromUser",
      [_userId]
    );
  },
  UpdateAnnouncements({ _userId }) {
    return __instance._execute(
      "Update announcements set quantity  = quantity + 1 where _userId = ?",
      [_userId]
    );
  },
  async ReadAnnouncements(idAnnouncement) {
    return __instance._execute(
      "Update detailedAnnouncement set state = 1 where _idAnnouncement = ?",
      [idAnnouncement]
    );
    // return await __instance._execute(
    //   "Select Ann.*, u.avatar, u._name from announcement as Ann, user as u where Ann._userId = ? and u._userName = Ann._fromUser",
    //   [userName]
    // );
  },
  CheckAnnouncements({ _userId }) {
    return __instance._execute(
      "Update announcements set quantity = 0 where _userId = ?",
      [_userId]
    );
  },
  deleteByIdLink(postId) {
    return __instance._query(
      "Delete from detailedAnnouncement where _idLink = ?",
      [postId]
    );
  },
  deleteByIdAnnouncement(idAnnouncement, userId) {
    const task1 = __instance._query(
      "Update announcements set quantity  = quantity - 1 where _userId = ? and quantity > 0 ",
      [userId]
    );
    const task2 = __instance._query(
      "Delete from detailedAnnouncement where _idAnnouncement = ?;",
      [idAnnouncement]
    );
    return Promise.all([task1, task2]);
  },
  deleteByIdOther({ _idOther, userId }) {
    const task1 = __instance._query(
      "Update announcements set quantity  = quantity - 1 where _userId = ? and quantity > 0 ",
      [userId]
    );
    const task2 = __instance._query(
      "Delete from detailedAnnouncement where _idOther = ?;",
      [_idOther]
    );
    return Promise.all([task1, task2]);
  },
};
export default Announcement;
