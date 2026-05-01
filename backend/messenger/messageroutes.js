// routes/message.routes.js
const express = require('express');
const router = express.Router();
const Message = require('./Message');
const Conversation = require('./Conversation');
const User = require('../user/User');
const { authentication } = require('../middlewares/authMiddleware');

// Get all conversations for the logged-in user
router.get('/conversations', authentication, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const conversations = await Conversation.find({
            participants: userId
        })
        .populate('participants', 'firstname lastname email picture')
        .sort({ lastMessageTime: -1 });
        
        // Format conversations
        const formattedConversations = conversations.map(conv => {
            const otherUser = conv.participants.find(p => p._id.toString() !== userId);
            return {
                conversationId: conv._id,
                user: otherUser,
                lastMessage: conv.lastMessage,
                lastMessageTime: conv.lastMessageTime,
                unreadCount: conv.unreadCount.get(userId.toString()) || 0
            };
        });
        
        res.status(200).send(formattedConversations);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching conversations' });
    }
});

// Get or create conversation with a user
router.get('/conversation/:userId', authentication, async (req, res) => {
    try {
        const currentUserId = req.user.userId;
        const otherUserId = req.params.userId;
        
        // Check if other user exists
        const otherUser = await User.findById(otherUserId).select('firstname lastname email picture');
        if (!otherUser) {
            return res.status(404).send({ message: 'User not found' });
        }
        
        // Find existing conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [currentUserId, otherUserId] }
        });
        
        // If no conversation exists, create a new one
        if (!conversation) {
            conversation = new Conversation({
                participants: [currentUserId, otherUserId],
                lastMessage: 'No messages yet',
                lastMessageTime: new Date(),
                unreadCount: new Map()
            });
            await conversation.save();
        }
        
        // Get messages between users
        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId }
            ]
        })
        .populate('sender', 'firstname lastname email picture')
        .populate('receiver', 'firstname lastname email picture')
        .sort({ createdAt: 1 });
        
        res.status(200).send({
            conversation: {
                conversationId: conversation._id,
                user: otherUser,
                lastMessage: conversation.lastMessage,
                lastMessageTime: conversation.lastMessageTime,
                unreadCount: conversation.unreadCount.get(currentUserId.toString()) || 0
            },
            messages: messages
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error getting conversation' });
    }
});

// Get messages between two users
router.get('/:userId', authentication, async (req, res) => {
    try {
        const currentUserId = req.user.userId;
        const otherUserId = req.params.userId;
        
        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId }
            ]
        })
        .populate('sender', 'firstname lastname email picture')
        .populate('receiver', 'firstname lastname email picture')
        .sort({ createdAt: 1 });
        
        // Mark messages as read
        await Message.updateMany(
            {
                sender: otherUserId,
                receiver: currentUserId,
                isRead: false
            },
            {
                isRead: true,
                readAt: new Date()
            }
        );
        
        // Update unread count in conversation
        const conversation = await Conversation.findOne({
            participants: { $all: [currentUserId, otherUserId] }
        });
        
        if (conversation) {
            conversation.unreadCount.set(currentUserId.toString(), 0);
            await conversation.save();
        }
        
        res.status(200).send(messages);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching messages' });
    }
});

// Send a new message
router.post('/send', authentication, async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user.userId;
        
        if (!receiverId || !message) {
            return res.status(400).send({ message: 'Receiver ID and message are required' });
        }
        
        // Create new message
        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            message: message
        });
        
        await newMessage.save();
        
        // Populate sender and receiver info
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
        
        // Update conversation
        conversation.lastMessage = message;
        conversation.lastMessageTime = new Date();
        
        // Increment unread count for receiver
        const currentUnread = conversation.unreadCount.get(receiverId.toString()) || 0;
        conversation.unreadCount.set(receiverId.toString(), currentUnread + 1);
        
        await conversation.save();
        
        res.status(201).send({
            message: 'Message sent successfully',
            data: newMessage
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error sending message' });
    }
});

// Delete a message (only for sender)
router.delete('/:messageId', authentication, async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const userId = req.user.userId;
        
        const message = await Message.findById(messageId);
        
        if (!message) {
            return res.status(404).send({ message: 'Message not found' });
        }
        
        // Only sender can delete their message
        if (message.sender.toString() !== userId) {
            return res.status(403).send({ message: 'Not authorized to delete this message' });
        }
        
        await message.deleteOne();
        
        res.status(200).send({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error deleting message' });
    }
});

// Get unread message count
router.get('/unread/count', authentication, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const unreadCount = await Message.countDocuments({
            receiver: userId,
            isRead: false
        });
        
        res.status(200).send({ unreadCount });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching unread count' });
    }
});

module.exports = router;