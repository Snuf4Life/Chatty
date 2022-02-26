import { User } from './User';

export enum MessageType {
  Question = 'question',
  Answer = 'answer',
  General = 'general',
  Welcome = 'welcome',
}

interface BaseMessage {
  id: string;
  text: string;
  user: User;
  type: MessageType;
}

export interface MessageInput extends Omit<BaseMessage, 'id'> {
  answeredMessageId?: string;
}

export interface Message extends BaseMessage {
  timestamp: number;
  answeredQuestion?: Omit<Message, 'answeredQuestion'>;
}
