// services/messageService.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const messageService = {
  async getConversations() {
    const response = await api.get('/messages/conversations');
    return response.data;
  },

  // New method to get or create conversation with a user
  async getOrCreateConversation(userId: string) {
    const response = await api.get(`/messages/conversation/${userId}`);
    return response.data;
  },

  async getMessages(userId: string) {
    const response = await api.get(`/messages/${userId}`);
    return response.data;
  },

  async sendMessage(receiverId: string, message: string) {
    const response = await api.post('/messages/send', { receiverId, message });
    return response.data;
  },

  async deleteMessage(messageId: string) {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get('/messages/unread/count');
    return response.data;
  }
};