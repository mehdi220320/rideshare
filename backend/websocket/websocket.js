// websocket/websocket.js
const jwt = require('jsonwebtoken');
const Message = require('../messenger/Message');
const Conversation = require('../messenger/Conversation');

const connectedUsers = new Map(); // userId -> socket

const setupWebSocket = (io) => {
    // Authentication middleware for socket.io
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            
            if (!token) {
                return next(new Error('Authentication error'));
            }
            
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            socket.userId = decoded.userId;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });
    
    io.on('connection', (socket) => {
        console.log(`User ${socket.userId} connected`);
        
        // Store connected user
        connectedUsers.set(socket.userId.toString(), socket);
        
        // Join user to their own room for private messages
        socket.join(`user_${socket.userId}`);
        
        // Handle sending messages
        socket.on('send_message', async (data) => {
            try {
                const { receiverId, message } = data;
                const senderId = socket.userId;
                
                // Save message to database
                const newMessage = new Message({
                    sender: senderId,
                    receiver: receiverId,
                    message: message
                });
                
                await newMessage.save();
                
                // Populate user info
                await newMessage.populate('sender', 'firstname lastname email picture');
                await newMessage.populate('receiver', 'firstname lastname email picture');
                
                // Update or create conversation
                let conversation = await Conversation.findOne({
                    participants: { $all: [senderId, receiverId] }
                });
                
                if (!conversation) {
                    conversation = new Conversation({
                        participants: [senderId, receiverId],
                        unreadCount: new Map()
                    });
                }
                
                conversation.lastMessage = message;
                conversation.lastMessageTime = new Date();
                
                // Increment unread count for receiver
                const currentUnread = conversation.unreadCount.get(receiverId.toString()) || 0;
                conversation.unreadCount.set(receiverId.toString(), currentUnread + 1);
                
                await conversation.save();
                
                // Emit to sender (for immediate feedback)
                socket.emit('message_sent', newMessage);
                
                // Emit to receiver if online
                const receiverSocket = connectedUsers.get(receiverId.toString());
                if (receiverSocket) {
                    receiverSocket.emit('new_message', newMessage);
                    
                    // Update conversation list for receiver
                    receiverSocket.emit('conversation_updated', {
                        conversationId: conversation._id,
                        lastMessage: message,
                        lastMessageTime: conversation.lastMessageTime,
                        sender: {
                            _id: senderId,
                            firstname: newMessage.sender.firstname,
                            lastname: newMessage.sender.lastname,
                            picture: newMessage.sender.picture
                        }
                    });
                }
                
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('message_error', { error: 'Failed to send message' });
            }
        });
        
        // Handle typing indicators
        socket.on('typing', (data) => {
            const { receiverId, isTyping } = data;
            const receiverSocket = connectedUsers.get(receiverId.toString());
            
            if (receiverSocket) {
                receiverSocket.emit('user_typing', {
                    userId: socket.userId,
                    isTyping
                });
            }
        });
        
        // Handle marking messages as read
        socket.on('mark_as_read', async (data) => {
            try {
                const { senderId } = data;
                const receiverId = socket.userId;
                
                await Message.updateMany(
                    {
                        sender: senderId,
                        receiver: receiverId,
                        isRead: false
                    },
                    {
                        isRead: true,
                        readAt: new Date()
                    }
                );
                
                // Update conversation unread count
                const conversation = await Conversation.findOne({
                    participants: { $all: [senderId, receiverId] }
                });
                
                if (conversation) {
                    conversation.unreadCount.set(receiverId.toString(), 0);
                    await conversation.save();
                }
                
                // Notify sender that messages were read
                const senderSocket = connectedUsers.get(senderId.toString());
                if (senderSocket) {
                    senderSocket.emit('messages_read', {
                        userId: receiverId,
                        readAt: new Date()
                    });
                }
                
            } catch (error) {
                console.error('Error marking messages as read:', error);
            }
        });
        
        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`User ${socket.userId} disconnected`);
            connectedUsers.delete(socket.userId.toString());
        });
    });
};

module.exports = { setupWebSocket, connectedUsers };