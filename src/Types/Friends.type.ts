export enum FriendsStatus {
  "Pending" = 1,
  "Friends",
  "Confirm Request",
  "Not Friends",
}

export interface FriendsProps {
  _idFriends: string;
  _UID1: string;
  _UID2: string;
  _createAt: string | Date;
  _status: FriendsStatus;
}
