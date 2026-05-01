// services/socketService.ts
import { io, Socket } from 'socket.io-client';
import type { Message } from '../types/message.types';

class SocketService {
  private socket: Socket | null = null;
  private messageHandlers: ((message: Message) => void)[] = [];
  private typingHandlers: ((data: { userId: string; isTyping: boolean }) => void)[] = [];
  private messageSentHandlers: ((message: Message) => void)[] = [];
  private conversationUpdateHandlers: ((data: any) => void)[] = [];

  connect() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    // Only connect if not already connected
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('new_message', (message: Message) => {
      this.messageHandlers.forEach(handler => handler(message));
    });

    this.socket.on('message_sent', (message: Message) => {
      this.messageSentHandlers.forEach(handler => handler(message));
    });

    this.socket.on('user_typing', (data: { userId: string; isTyping: boolean }) => {
      this.typingHandlers.forEach(handler => handler(data));
    });

    this.socket.on('conversation_updated', (data: any) => {
      this.conversationUpdateHandlers.forEach(handler => handler(data));
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });
  }

  disconnect() {
    if (this.socket) {
      // Remove all listeners before disconnecting
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(receiverId: string, message: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('send_message', { receiverId, message });
    } else {
      console.error('Socket not connected');
      // Try to reconnect
      this.connect();
      setTimeout(() => {
        if (this.socket && this.socket.connected) {
          this.socket.emit('send_message', { receiverId, message });
        }
      }, 1000);
    }
  }

  sendTyping(receiverId: string, isTyping: boolean) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('typing', { receiverId, isTyping });
    }
  }

  markAsRead(senderId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('mark_as_read', { senderId });
    }
  }

  onNewMessage(handler: (message: Message) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  onTyping(handler: (data: { userId: string; isTyping: boolean }) => void) {
    this.typingHandlers.push(handler);
    return () => {
      this.typingHandlers = this.typingHandlers.filter(h => h !== handler);
    };
  }

  onMessageSent(handler: (message: Message) => void) {
    this.messageSentHandlers.push(handler);
    return () => {
      this.messageSentHandlers = this.messageSentHandlers.filter(h => h !== handler);
    };
  }

  onConversationUpdate(handler: (data: any) => void) {
    this.conversationUpdateHandlers.push(handler);
    return () => {
      this.conversationUpdateHandlers = this.conversationUpdateHandlers.filter(h => h !== handler);
    };
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();