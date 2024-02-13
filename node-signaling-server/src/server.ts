import express from 'express';
import https from 'https';
import fs from 'fs';
import WebSocket, { WebSocketServer } from 'ws';

const app = express();
const key = fs.readFileSync('./server.key', 'utf8');
const cert = fs.readFileSync('./server.cert', 'utf8');
const server = https.createServer({ key, cert }, app);

const wss = new WebSocketServer({ server });

interface Room {
  users: Map<string, WebSocket>;
}

const rooms: Record<string, Room> = {};

wss.on('connection', (ws: WebSocket) => {
  let currentUserRoomId: string | null = null;
  let currentUserId: string | null = null;

  ws.on('message', (message: string) => {

    let data: any;
    try {
      data = JSON.parse(message);
      console.log('Received message:', data);
    } catch (error) {
      console.error('Invalid JSON', error);
      return;
    }

    switch (data.type) {
      case 'join':
        const roomId = data.target.username; // Generate a new room ID if not provided
        const userId = data.local.userId ; // Assign a unique ID to the user
        currentUserRoomId = roomId;
        currentUserId = userId;

        if (!rooms[roomId]) {
          rooms[roomId] = { users: new Map() };
        }

        rooms[roomId].users.set(userId, ws);
        broadcastToRoom(roomId, userId);
        break;

      case 'offer':
      case 'answer':
      case 'candidate':
        // Forward these messages to the specific user in the room
        if (currentUserRoomId) {
          const targetUser = rooms[currentUserRoomId]?.users.get(data.target.userId);
          if (targetUser) {
            targetUser.send(message);
          }
        }
        break;

      // case 'leave':
      //   if (currentUserRoomId && currentUserId) {
      //     leaveRoom(currentUserRoomId, currentUserId);
      //     broadcastToRoom(currentUserRoomId, currentUserId, { type: 'user-left', userId: currentUserId });
      //   }
      //   break;

      default:
        console.warn('Unhandled message type:', data.type);
    }
  });

  // ws.on('close', () => {
  //   if (currentUserRoomId && currentUserId) {
  //     leaveRoom(currentUserRoomId, currentUserId);
  //     broadcastToRoom(currentUserRoomId, currentUserId, { type: 'user-left', userId: currentUserId });
  //   }
  // });
});

function leaveRoom(roomId: string, userId: string) {
  const room = rooms[roomId];
  if (room) {
    room.users.delete(userId);
    if (room.users.size === 0) {
      delete rooms[roomId];
    }
  }
}

function broadcastToRoom(roomId: string, senderId: string) {
  const room = rooms[roomId];
  if (!room) return;

  room.users.forEach((ws, userId) => {
    if (userId !== senderId) {
      console.log('Broadcasting to', userId);
      ws.send(JSON.stringify(message));
    }
  });
}

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on https://localhost:${port}`);
});
