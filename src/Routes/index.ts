import { Application } from "express";
import Authentication from "./Authentication.route";
import User from "./User.route";
import Mail from "./Mail.route";
import Posts from "./Posts.route";
import Comments from "./Comments.route";
import Announcement from "./Announcement.route";
import PostReactions from "./PostReactions.route";
import CommentsReactions from "./CommentsReactions.route";
import { FriendsRouter } from "./Friends.route";
import { ConversationsRouter } from "./Conversations.route";
import { messagesNotificationsRoute } from "./MessagesNotifications.route";

export function route(app: Application) {
  app.use(Authentication);
  app.use(User);
  app.use(Comments);
  app.use(Mail);
  app.use(Posts);
  app.use(Announcement);
  app.use(FriendsRouter);
  app.use(CommentsReactions);
  app.use(PostReactions);
  app.use(ConversationsRouter);
  app.use(messagesNotificationsRoute);
}
