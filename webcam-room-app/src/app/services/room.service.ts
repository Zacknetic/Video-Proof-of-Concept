import { Injectable } from '@angular/core';
import { Room } from '../../types/dataTypes';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private currentRoom: Room = { name: '', id: '' };

  constructor() { }

  public setCurrentRoom(roomName: string) {
   const sanitizedRoomName = this.sanitizeRoomName(roomName);
    if (!this.verifyRoomName(sanitizedRoomName)) {
      throw new Error('Invalid room name');
    }

    this.currentRoom = { name: sanitizedRoomName, id: this.generateRoomId() };

    return this.currentRoom.id;
  }

  public getCurrentRoom(): Room {
    return this.currentRoom;
  }

  generateRoomId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  sanitizeRoomName(roomName: string): string {
    // Implement sanitization logic here
    // Simple example: remove special characters
    return roomName.replace(/[^\w]/gi, '');
  }

  verifyRoomName(roomName: string): boolean {
    // Implement verification logic here
    // Simple example: ensure roomName is not empty
    return roomName.length > 0;
  }
}
