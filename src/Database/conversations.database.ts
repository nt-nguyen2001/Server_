import { DB } from ".";
import {
  ConverSations,
  ConversationState,
  MembersOfConversations,
} from "../Types/Conversations.type";

const _instance = DB.getInstance();

export const ConverSationsDB = {
  create: ({
    conversations: {
      _content,
      _createAt,
      _fromUID,
      _state,
      _taggedUID,
      ...conversation
    },
    member,
  }: {
    conversations: ConverSations;
    member: MembersOfConversations[];
  }) => {
    const task1 = _instance._query(
      "Insert into conversations values(?,?,?,?,?,?,?)",
      [
        conversation._idConversations,
        _fromUID,
        _content,
        _createAt,
        _state,
        _taggedUID,
        null,
      ]
    );
    const task2 = _instance._query(
      "Insert into memberOfConversations values(?)",
      [member]
    );
    return Promise.all([task1, task2]);
  },
  addText: ({
    _content,
    _createAt,
    _fromUID,
    _idConversations,
    _state,
    _taggedUID,
    _textId,
  }: ConverSations) => {
    return _instance._query(
      "Insert into conversations values(?,?,?,?,?,?,?,?)",
      [
        _idConversations,
        _fromUID,
        _content,
        new Date(_createAt),
        _state,
        _taggedUID,
        _textId,
        null,
      ]
    );
  },
  addMember: ({
    _UID,
    _idConversations,
    _joinAt,
    _role,
  }: MembersOfConversations) => {
    return _instance._query(
      "Insert into memberOfConversations values(?,?,?,?)",
      [_idConversations, _UID, _joinAt, _role]
    );
  },
  getConversationsById: ({
    _idConversations,
    limit,
    offset,
  }: Pick<ConverSations, "_idConversations"> & {
    limit: number;
    offset: number;
  }) => {
    return _instance._query<ConverSations>(
      `Select * from conversations where _idConversations = ? order by _createAt DESC limit ${offset},${limit}`,
      [_idConversations]
    );
  },
  getConversationsByUID({ _fromUID }: Pick<ConverSations, "_fromUID">) {
    return _instance._query<ConverSations[]>(
      "select  c.*,f._idFriends, u._userId,u._name,u.avatar,u._userName from conversations as c left join Friends as f on f._idFriends = c._idConversations left join user as u on u._userId = (if(f._UID1 != ?,f._UID1,f._UID2)) where  _textId = (Select _textId from conversations where _idConversations = f._idFriends order by _createAt DESC limit 1) and (f._UID1 = ? or f._UID2 = ?)",
      [_fromUID, _fromUID, _fromUID]
    );
  },
  updateConversations({
    _idConversations,
    _state,
  }: Pick<ConverSations, "_idConversations" | "_state">) {
    return _instance._query<ConverSations>(
      `update conversations set _state = ? where _idConversations = ? and _state != ${ConversationState.Read}`,
      [_state, _idConversations]
    );
  },
  deleteMessage({ _textId }: Pick<ConverSations, "_textId">) {
    return _instance._query(
      "Update conversations set _content  = '', _type = 1 where _textId = ?",
      [_textId]
    );
  },
};
