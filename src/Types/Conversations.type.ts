export enum ConversationState {
  "Sent" = 1,
  "Received",
  "Read",
  "Deleted",
}

export enum UIDRole {
  "owner" = 1,
  "co-owner",
  "member",
}

interface ConverSationsI {
  _idConversations: string;
}

export interface ConverSations extends ConverSationsI {
  _textId: string;
  _fromUID: string;
  _content: string;
  _createAt: string | Date;
  _state: ConversationState;
  _taggedUID: string;
  _type: "Delete";
}

export interface MembersOfConversations extends ConverSationsI {
  _UID: string;
  _joinAt: string | Date;
  _role: UIDRole;
}
