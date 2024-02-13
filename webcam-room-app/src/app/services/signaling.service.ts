import { Injectable } from '@angular/core';
import { VideoService } from './video.service';
import { UserService } from './user.service';
import { PeerConnectionService } from './peer-connection.service';
import {
  SignalingData,
  Room,
  SignalingOffer,
  SignalingAnswer,
  SignalingCandiate,
  SignalingMessage,
  SignalingJoin,
} from '../../types/dataTypes';

@Injectable({
  providedIn: 'root',
})
export class SignalingService {
  private signaling!: WebSocket;
  private rooms: Room[] = [];

  constructor(
    private userService: UserService,
    private peerService: PeerConnectionService
  ) {
   
  }

  ngOnInit(): void {
    this.initializeSignaling();
  }

  private initializeSignaling(): void {
    this.signaling = new WebSocket('wss://192.168.50.12:3000');
    this.signaling.onopen = () => this.onOpen();
    this.signaling.onclose = () => console.log('Disconnected from signaling server');
    this.signaling.onerror = (error) => console.error('Signaling server error:', error);
    this.signaling.onmessage = (event) => this.handleSignalingData(JSON.parse(event.data));
  }

  private onOpen(): void {
    console.log('Connected to signaling server');
    const joinData: SignalingJoin = {
      type: 'join',
      local: this.userService.getLocalUser(),
      target: { username: 'room1', userId: 'acb123' },
    };
    
    this.sendSignalingData(joinData);
  }

  private handleSignalingData(data: SignalingData): void {
    if ('type' in data) {
      switch (data.type) {
        case 'offer':
          this.handleOffer(data as SignalingOffer);
          break;
        case 'answer':
          this.handleAnswer(data as SignalingAnswer);
          break;
        case 'candidate':
          this.handleCandidate(data as SignalingCandiate);
          break;
        case 'user-joined':
          this.handleUserJoined(data);
          break;
        case 'user-left':
          this.handleUserLeft(data);
          break;
        default:
          console.warn('Invalid signaling data type:', data.type);
      }
    } else if ('rooms' in data) {
      this.rooms = data.rooms;
    }
  }

  private async handleOffer(offer: SignalingOffer) {
    const peerConnection = await this.peerService.getOrCreatePeerConnection(offer.target);
    await this.processRemoteDescription(peerConnection, offer.offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    this.sendSignalingData({
      type: 'answer',
      answer,
      local: this.userService.getLocalUser(),
      target: offer.target,
    });
  }

  private async handleAnswer(answer: SignalingAnswer) {
    const peerConnection = await this.peerService.getOrCreatePeerConnection(answer.target);
    peerConnection && this.processRemoteDescription(peerConnection, answer.answer);
  }

  private async handleCandidate(candidate: SignalingCandiate) {
    const peerConnection = await this.peerService.getOrCreatePeerConnection(candidate.target);
    if (peerConnection && candidate.candidate) {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate.candidate));
    }
  }

  private async handleUserJoined(joined: SignalingMessage<any>) {
    const peerConnection = await this.peerService.getOrCreatePeerConnection(joined.target);
    this.setupIceCandidateHandler(peerConnection, joined.target);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    this.sendSignalingData({
      type: 'offer',
      offer,
      local: this.userService.getLocalUser(),
      target: joined.target,
    });
  }

  handleUserLeft(data: SignalingData) {
    console.log('User left:', data);
    // Implement logic to handle a user leaving
  }

  public sendSignalingData(data: SignalingData | SignalingJoin): void {
    if (this.signaling.readyState === WebSocket.OPEN) {
      this.signaling.send(JSON.stringify(data));
    }
  }

  private async processRemoteDescription(peerConnection: RTCPeerConnection, description: RTCSessionDescriptionInit) {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(description));
  }

  private setupIceCandidateHandler(peerConnection: RTCPeerConnection, target: { username: string; userId: string }) {
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignalingData({
          type: 'candidate',
          candidate: event.candidate,
          local: this.userService.getLocalUser(),
          target: target,
        });
      }
    };
  }

  // getRooms(): Room[] {
  //   this.sendSignalingData({ type: 'get-rooms' });
  //   return this.rooms;
  // }
}
