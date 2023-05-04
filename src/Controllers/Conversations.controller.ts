import { Request, Response } from "express";
import { ConverSationsDB } from "../Database/conversations.database";
import {
  ConverSations,
  ConversationState,
  MembersOfConversations,
} from "../Types/Conversations.type";
import { ResponseError } from "../Utils/CustomThrowError.Utils";

type CreatedConverSationsPayload = {
  conversations: ConverSations;
  member: MembersOfConversations[];
};

export async function CreateConverSations(req: Request, res: Response) {
  const conversation = req.body.payload as ConverSations;
  if (!conversation) {
    throw new ResponseError("Payload is empty");
  }
  await ConverSationsDB.addText(conversation);
  res.send({ status: 200, message: "OK", payload: { conversation } });
}

export async function GetConversationsById(req: Request, res: Response) {
  const _idConversations = req.params.id as string;
  const limit = req.query.limit as string;
  const offset = req.query.offset as string;
  if (!_idConversations) {
    throw new ResponseError("Id is empty!");
  }
  const payload = await ConverSationsDB.getConversationsById({
    limit: Number(limit || 15),
    offset: Number(offset || 0),
    _idConversations,
  });

  setTimeout(() => {
    res.send({
      status: 200,
      message: "OK",
      payload: payload.reverse(),
    });
  }, 3000);
}

export async function GetConversationsByUID(req: Request, res: Response) {
  const _UID = req.params.id as string;
  if (!_UID) {
    throw new ResponseError("Id is empty!");
  }
  const payload = await ConverSationsDB.getConversationsByUID({
    _fromUID: _UID,
  });

  res.send({
    status: 200,
    message: "OK",
    payload,
  });
}

export async function UpdateConversationsState(req: Request, res: Response) {
  const id = req.params.id as string;
  const state = req.body.payload._state as ConversationState;
  if (!id || !state) {
    throw new ResponseError("Id or state is empty");
  }
  await ConverSationsDB.updateConversations({
    _idConversations: id,
    _state: state,
  });
  res.send({
    status: 200,
    message: "OK",
  });
}

export async function DeleteMessages(req: Request, res: Response) {
  const _textId = req.params.id as string;
  const payload = req.body?.payload || {};
  if (!_textId) {
    throw new ResponseError("TextId is empty!");
  }
  await ConverSationsDB.deleteMessage({ _textId });
  res.send({
    status: 200,
    message: "OK",
    payload: { _textId, ...payload },
  });
}
