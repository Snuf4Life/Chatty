export enum UserType {
  User = 'user',
  Bot = 'bot',
}

export interface User {
  username: string;
  type: UserType;
  id?: string;
}
