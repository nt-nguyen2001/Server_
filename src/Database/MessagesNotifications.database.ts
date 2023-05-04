import { DB } from ".";
import { ConverSations } from "../Types/Conversations.type";

const __instance = DB.getInstance();

export const MessagesNotificationsDB = {
  get({ _UID }: { _UID: string }) {
    return __instance._query<{ quantity: string }>(
      "Select quantity from messagesNotifications where _UID = ?",
      [_UID]
    );
  },
  create({ quantity, UID }: { UID: string; quantity: number }) {
    return __instance._query("Insert into messagesNotifications values(?,?)", [
      UID,
      quantity,
    ]);
  },
  increase({ UID }: { UID: string }) {
    return __instance._query(
      "Update messagesNotifications set quantity = quantity + 1 where _UID = ?",
      [UID]
    );
  },
  check({ _UID }: { _UID: string }) {
    return __instance._query(
      "Update messagesNotifications set quantity = 0 where _UID = ?",
      [_UID]
    );
  },
};
