import { Injectable, Type } from '@angular/core';
import { VideoService } from './video.service';
import {
	PeerInfo,
	SignalingData,
	User,
	Room,
	SignalingAnswer,
	SignalingMessage,
	SignalingOffer,
	SignalingCandiate,
} from '../../types/dataTypes';
import { UserService } from './user.service';
import { PeerConnectionService } from './peer-connection.service';

@Injectable({
	providedIn: 'root',
})
export class SignalingService {
	private signaling!: WebSocket;
	private rooms: Room[] = [];

	constructor(
		private videoService: VideoService,
		private userService: UserService,
		private peerService: PeerConnectionService
	) {}

	ngOnInit(): void {
		this.initializeSignaling();
	}

	initializeSignaling() {
		this.signaling = this.createSignalingConnection();
		this.initializeSignalingListeners();
	}

	private createSignalingConnection(): WebSocket {
		const signaling: WebSocket = new WebSocket('wss://192.168.50.12:3000');
		return signaling;
	}

	private initializeSignalingListeners() {
		this.signaling.onopen = () => {
			console.log('Connected to signaling server');
      this.signaling.send(
				JSON.stringify({
					type: 'join',
					roomId: "exampleRoomId", // Replace with actual room ID
					user: this.userService.getLocalUser(),
				})
			);
		};

		this.signaling.onclose = () => {
			console.log('Disconnected from signaling server');
		};

		this.signaling.onerror = (error) => {
			console.error('Signaling server error:', error);
		};

		this.signaling.onmessage = (event) => {
			console.log('Received message:', event.data);
			this.handleSignalingData(event.data);
		};
	}

	private handleSignalingData(data: string) {
		const signalingData: SignalingData = JSON.parse(data);

		if ('type' in signalingData) {
			switch (signalingData.type) {
				case 'offer':
					this.handleOffer(signalingData as SignalingOffer);
					break;
				case 'answer':
					this.handleAnswer(signalingData as SignalingAnswer);
					break;
				case 'candidate':
					this.handleCandidate(signalingData as SignalingCandiate);
					break;
				case 'user-joined':
					this.handleUserJoined(signalingData);
					break;
				case 'user-left':
					this.handleUserLeft(signalingData);
					break;
				default:
					console.warn('Invalid signaling data type:', signalingData.type);
			}
		} else if ('rooms' in signalingData) {
			this.rooms = signalingData.rooms;
		}
	}

	private async handleOffer(signalingOffer: SignalingOffer) {
		console.log(
			`Received offer from ${signalingOffer.target.username} (${signalingOffer.target.userId})`
		);

		const peerConnection = this.getPeerConnection(signalingOffer);

		await peerConnection.setRemoteDescription(
			new RTCSessionDescription(signalingOffer.offer)
		);
		const answer = await peerConnection.createAnswer();
		await peerConnection.setLocalDescription(answer);

		const answerData: SignalingAnswer = {
			type: 'answer',
			answer,
			local: this.userService.getLocalUser(),
			target: signalingOffer.target,
		};
		this.sendSignalingData(answerData);
	}

	private handleAnswer(signalingAnswer: SignalingAnswer) {
		console.log(
			`Received answer from ${signalingAnswer.target.username} (${signalingAnswer.target.userId})`
		);

		const peerConnection = this.getPeerConnection(signalingAnswer);

		if (peerConnection) {
			peerConnection.setRemoteDescription(
				new RTCSessionDescription(signalingAnswer.answer)
			);
		}
	}

	handleCandidate(signalingCandidate: SignalingCandiate) {
		const peerConnection = this.getPeerConnection(signalingCandidate);

		if (peerConnection && signalingCandidate.candidate) {
			peerConnection.addIceCandidate(
				new RTCIceCandidate(signalingCandidate.candidate)
			);
		}
	}

	async handleUserJoined(signalingJoined: SignalingMessage<any>) {
		this.peerService.createPeerConnection(signalingJoined.target);
		const peerConnection = this.getPeerConnection(signalingJoined);
		peerConnection.onicecandidate = (event) => {
			if (event.candidate) {
				console.log(
					`Sending ice candidate to ${signalingJoined.target.username} (${signalingJoined.target.userId})`
				);

				const signalingData: SignalingData = {
					type: 'candidate',
					candidate: event.candidate,
					local: this.userService.getLocalUser(),
					target: signalingJoined.target,
				};
				this.sendSignalingData(signalingData);
			}
		};
		if (peerConnection) {
			const offer = await peerConnection.createOffer();
			await peerConnection.setLocalDescription(offer);

			const offerData: SignalingOffer = {
				type: 'offer',
				offer,
				local: this.userService.getLocalUser(),
				target: signalingJoined.target,
			};
			this.sendSignalingData(offerData);
		}
	}

	handleUserLeft(signalingData: SignalingData) {
		throw new Error('Method not implemented.');
	}

	sendSignalingData(signalingData: SignalingData) {
		if (!this.signaling || this.signaling.readyState !== WebSocket.OPEN) {
			this.initializeSignaling();
		}

		this.signaling.send(JSON.stringify(signalingData));
	}

	getRooms(): Room[] {
		this.signaling.send(JSON.stringify({ type: 'get-rooms' }));
		return this.rooms;
	}

	private getPeerConnection(signalingData: SignalingData): RTCPeerConnection {
		throw new Error('Method not implemented.');
	}
}
