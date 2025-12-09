import api from '../services/api';
import type { Message, ApiResponse, SendMessageData } from '../types/common.types';

export const messagesAPI = {
  getMessages: () =>
    api.get<ApiResponse<Message[]>>('/api/messages'),

  getSentMessages: () =>
    api.get<ApiResponse<Message[]>>('/api/messages/sent'),

  getMessage: (id: number) =>
    api.get<ApiResponse<Message>>(`/api/messages/${id}`),

  sendMessage: (data: SendMessageData) =>
    api.post<ApiResponse<Message>>('/api/messages', data),

  markAsRead: (id: number) =>
    api.put(`/api/messages/${id}/read`),

  deleteMessage: (id: number) =>
    api.delete(`/api/messages/${id}`),
};
