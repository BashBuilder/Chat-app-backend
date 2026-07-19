import { env } from '@/config/env';
import { HttpError, InternalServerError, USER_ID_HEADER } from '@chatapp/common';
import axios from 'axios';

const client = axios.create({
  baseURL: env.CHAT_SERVICE_URL,
  timeout: 5000,
  headers: {
    'X-Internal-Token': env.INTERNAL_API_TOKEN,
  },
});

const resolvedMessage = (status: number, data: unknown): string => {
  if (typeof data === 'object' && data && 'message' in data) {
    const message = (data as Record<string, unknown>).message;

    if (typeof message === 'string' && message.trimEnd().length > 0) {
      return message;
    }
  }

  return status >= 500
    ? 'Authentication service is unavailable'
    : 'An error occurred while processing the request';
};

const handleAxiosError = (error: unknown): never => {
  if (!axios.isAxiosError(error) || !error.response) {
    throw new InternalServerError('User service server is unavailable');
  }

  const { status, data } = error.response as { status: number; data: unknown };

  throw new HttpError(status, resolvedMessage(status, data));
};

export interface ConversationDto {
  id: string;
  title: string;
  participantIds: string[];
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  lastMessagePreview: string;
}

export interface ReactionDto {
  emoji: string;
  userId: string;
  createdAt: string;
}

export interface MessageDto {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  reactions: ReactionDto[];
}

export interface ConversationResponse {
  data: ConversationDto;
}

export interface ConversationListResponse {
  data: ConversationDto[];
}

export interface MessageResponse {
  data: MessageDto;
}

export interface MessageListResponse {
  data: MessageDto[];
}
export interface CreateConversationPayload {
  title: string | null;
  participantIds: string[];
}

export interface CreateMessagePayload {
  body: string;
}

export const chatProxyService = {
  async createConversation(
    userId: string,
    payload: CreateConversationPayload,
  ): Promise<ConversationDto> {
    try {
      const response = await client.post<ConversationResponse>(`/conversations`, payload, {
        headers: {
          [USER_ID_HEADER]: userId,
        },
      });
      return response.data.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async listConversations(userId: string): Promise<ConversationListResponse> {
    try {
      const response = await client.get<ConversationListResponse>(
        `/conversations?participantId=${userId}`,

        {
          headers: {
            [USER_ID_HEADER]: userId,
          },
        },
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },

  async getConversation(userId: string, id: string): Promise<ConversationDto> {
    try {
      const response = await client.get<ConversationDto>(`/conversations/${id}`, {
        headers: {
          [USER_ID_HEADER]: userId,
        },
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  },
};
