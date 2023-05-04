import { Router } from "express";
import {
  CheckMessagesNotifications,
  GetNumberOfMessagesNotifications,
  IncreaseMessagesNotifications,
} from "../Controllers/MessagesNotifications";
import TCWrapper from "../Utils/TCWrapper.Utils";

const messagesNotificationsRoute = Router();

messagesNotificationsRoute
  .get(
    "/api/notifications/messages/:id",
    TCWrapper(GetNumberOfMessagesNotifications)
  )
  .patch(
    "/api/notifications/messages/:id/quantity",
    TCWrapper(CheckMessagesNotifications)
  )
  .patch(
    "/api/notifications/messages",
    TCWrapper(IncreaseMessagesNotifications)
  );

export { messagesNotificationsRoute };
