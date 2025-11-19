import jwt from 'jsonwebtoken';
import { users, onlineUsers, rooms, messages } from '../server.js';

export default function socketHandler(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));

    try {
      const decoded = jwt.verify(token, 'secret-key-chat-2025');
      socket.username = decoded.username;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const username = socket.username;
    users.set(socket.id, { username, socket });
    onlineUsers.add(username);

    // Initialize rooms
    if (!rooms.has('general')) {
      rooms.set('general', new Set());
      messages.set('general', []);
    }

    socket.join('general');
    rooms.get('general').add(socket.id);

    // Broadcast online users
    io.emit('online_users', Array.from(onlineUsers));
    socket.emit('rooms_list', Array.from(rooms.keys()));

    // Send previous messages
    socket.emit('previous_messages', {
      room: 'general',
      messages: messages.get('general') || []
    });

    socket.on('join_room', (room) => {
      socket.leaveAll();
      if (!rooms.has(room)) {
        rooms.set(room, new Set());
        messages.set(room, []);
      }
      socket.join(room);
      rooms.get(room).add(socket.id);
      socket.emit('previous_messages', { room, messages: messages.get(room) });
      socket.emit('room_joined', room);
    });

    socket.on('send_message', ({ room, content, type = 'text', fileUrl }) => {
      const message = {
        id: Date.now() + Math.random(),
        username,
        content,
        fileUrl,
        type,
        timestamp: new Date(),
        readBy: [username]
      };

      if (!messages.has(room)) messages.set(room, []);
      messages.get(room).push(message);

      io.to(room).emit('new_message', message);

      // Notification for private chat
      if (room !== 'general' && room !== username) {
        const target = Array.from(users.values()).find(u => u.username === room);
        if (target) {
          target.socket.emit('private_notification', { from: username, preview: content.slice(0, 30) });
        }
      }
    });

    socket.on('typing', ({ room, isTyping }) => {
      socket.to(room).emit('user_typing', { username, isTyping });
    });

    socket.on('message_read', ({ messageId, room }) => {
      const roomMessages = messages.get(room);
      if (roomMessages) {
        const msg = roomMessages.find(m => m.id === messageId);
        if (msg && !msg.readBy.includes(username)) {
          msg.readBy.push(username);
          io.to(room).emit('message_read', { messageId, username });
        }
      }
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(username);
      users.delete(socket.id);
      io.emit('online_users', Array.from(onlineUsers));
    });
  });
}