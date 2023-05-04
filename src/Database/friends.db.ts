import { DB } from ".";
import { TUser } from "../Types";
import { MembersOfConversations } from "../Types/Conversations.type";
import { FriendsProps, FriendsStatus } from "../Types/Friends.type";

const _instance = DB.getInstance();

const Friends = {
  getAll(id: string) {
    return _instance._query<
      FriendsProps & Pick<TUser, "avatar" | "_name" | "_userId" | "_userName">
    >(
      "select f.*, u._name, u.avatar, u._userId, u._userName from Friends as f left join user as u on u._userId = IF(f._UID1 !=  ?, _UID1, _UID2) where f._UID1 = ? or f._UID2 = ? and f._status = ?;",
      [id, id, id, FriendsStatus.Friends]
    );
  },
  getFriendStatus({ id1, id2 }: { id1: string; id2: string }) {
    return _instance._query<FriendsProps>(
      "Select * from Friends where _idFriends = ? or _idFriends = ?",
      [id1, id2]
    );
  },
  create({ _UID1, _UID2, _createAt, _status, _idFriends }: FriendsProps) {
    return _instance._query("Insert into Friends values(?,?,?,?,?)", [
      _UID1,
      _UID2,
      new Date(_createAt),
      _status,
      _idFriends,
    ]);
  },
  deleteInvitation({ _idFriends }: Pick<FriendsProps, "_idFriends">) {
    return _instance._query("Delete from Friends where _idFriends = ?", [
      _idFriends,
    ]);
  },
  acceptFriends({
    _idFriends,
    _status,
    _createAt,
  }: Pick<FriendsProps, "_idFriends" | "_status" | "_createAt">) {
    return _instance._query(
      "Update Friends set _status = ?, _createAt = ? where _idFriends = ? ",
      [_status, new Date(_createAt), _idFriends]
    );
  },
  async getInfoFriends({
    _userId,
    limit,
  }: Pick<TUser, "_userId"> & { limit: number }) {
    const quantity = _instance._query<{ quantity: number }>(
      "Select count(_idFriends) as quantity from Friends where _UID1 = ? and _status = ? or _UID2 = ? and _status = ?",
      [_userId, FriendsStatus.Friends, _userId, FriendsStatus.Friends]
    );
    const friends = _instance._query<
      FriendsProps & Pick<TUser, "avatar" | "_name" | "_userId" | "_userName">
    >(
      "select f._createAt,f._status,f._idFriends, u._name, u.avatar, u._userId, u._userName from Friends as f left join user as u on u._userId = IF(f._UID1 !=  ?, _UID1, _UID2) where f._UID1 = ? and f._status = ? or f._UID2 = ? and f._status = ? limit ?",
      [
        _userId,
        _userId,
        FriendsStatus.Friends,
        _userId,
        FriendsStatus.Friends,
        limit,
      ]
    );
    return Promise.all([quantity, friends]);
  },
};
export { Friends };
