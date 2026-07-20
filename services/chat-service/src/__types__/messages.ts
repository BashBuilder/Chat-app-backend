export interface Reaction {
  emoji: string;
  userId: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  reactions: Reaction[];
}

export interface CreateMessageInput {
  conversationId: string;
  senderId: string;
  body: string;
}

export interface MessageListOptions {
  conversationId: string;
  limit?: number;
  before?: string;
  after?: string;
}

export interface AddReactionInput {
  messageId: string;
  conversationId: string;
  emoji: string;
  userId: string;
}

export interface RemoveReactionInput {
  messageId: string;
  conversationId: string;
  emoji: string;
  userId: string;
}
