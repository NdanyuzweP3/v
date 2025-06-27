import { apiService } from './api';
import { Message, SendMessageRequest } from '../types';

class MessageService {
  async sendMessage(messageData: SendMessageRequest): Promise<{ message: string; data: Message }> {
    return apiService.post('/messages', messageData);
  }

  async getMessages(params?: { orderId?: number; withUserId?: number }): Promise<{ messages: Message[] }> {
    return apiService.get('/messages', params);
  }

  async markMessageAsRead(messageId: number): Promise<{ message: string }> {
    return apiService.patch(`/messages/${messageId}/read`);
  }

  async getConversations(): Promise<{ conversations: any[] }> {
    return apiService.get('/messages/conversations');
  }
}

export const messageService = new MessageService();