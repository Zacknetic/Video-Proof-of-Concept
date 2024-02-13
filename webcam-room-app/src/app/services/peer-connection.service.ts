import { Injectable, Injector } from '@angular/core';
import { VideoService } from './video.service';
import { UserService } from './user.service';
import { User } from '../../types/dataTypes';
import { SignalingService } from './signaling.service';

@Injectable({
	providedIn: 'root',
})
export class PeerConnectionService {
	private peerConnections: Map<string, RTCPeerConnection> = new Map();

	constructor(
		private videoService: VideoService,
		private userService: UserService,
		private injector: Injector // Inject Angular's Injector
	) {}

	public async createPeerConnection(
		remoteUser: User
	): Promise<RTCPeerConnection> {
		if (this.userService.getLocalUser().userId === remoteUser.userId)
			throw new Error('Cannot create peer connection with self');
		if (this.peerConnections.has(remoteUser.userId))
			return this.peerConnections.get(remoteUser.userId)!; // Return existing connection if already exists

		console.log(
			`Creating peer connection with ${remoteUser.username} (${remoteUser.userId})`
		);
		const peerConnection = new RTCPeerConnection({
			iceServers: [
				{
					urls: 'turn:192.168.50.12:3478', // TURN server's address
					username: 'exampleUser', // TURN server username
					credential: 'examplePassword', // TURN server password
				},
			],
		});

		const localStream = await this.videoService.getLocalStream();
		localStream
			.getTracks()
			.forEach((track) => peerConnection.addTrack(track, localStream));

		const offer = await peerConnection.createOffer();
		await peerConnection.setLocalDescription(offer);

		const signalingService = this.injector.get(SignalingService);

		// Prepare the offer data
		const offerData = {
			type: 'offer',
			offer: offer, // Ensure you're sending the SDP (Session Description Protocol)
			local: this.userService.getLocalUser(),
			target: remoteUser, // Ensure the target is correctly formatted for your signaling needs
		};

		// Send the offer through the SignalingService
		signalingService.sendSignalingData(offerData);

		peerConnection.ontrack = (event) => this.onRemoteTrack(event, remoteUser);
		peerConnection.onicecandidate = (event) =>
			this.onIceCandidate(event, remoteUser);

		this.peerConnections.set(remoteUser.userId, peerConnection);
		return peerConnection;
	}

	private onRemoteTrack(event: RTCTrackEvent, remoteUser: User) {
		console.log(
			`Received remote track from ${remoteUser.username} (${remoteUser.userId})`
		);
		if (event.streams && event.streams[0]) {
			this.videoService.addVideoStream(event.streams[0], remoteUser);
		} else {
			console.warn('No remote stream found');
		}
	}

	private onIceCandidate(event: RTCPeerConnectionIceEvent, remoteUser: User) {
		if (event.candidate) {
			console.log(`Local ICE candidate: ${event.candidate.candidate}`);
			const signalingService = this.injector.get(SignalingService); // Use the class directly
			signalingService.sendSignalingData({
				type: 'candidate',
				candidate: event.candidate,
				local: this.userService.getLocalUser(),
				target: remoteUser,
			});
		}
	}

	public async getOrCreatePeerConnection(
		remoteUser: User
	): Promise<RTCPeerConnection> {
		return (
			this.peerConnections.get(remoteUser.userId) ||
			(await this.createPeerConnection(remoteUser))
		);
	}

	public async closePeerConnection(remoteUserId: string): Promise<void> {
		const peerConnection = this.peerConnections.get(remoteUserId);
		if (peerConnection) {
			console.log(`Closing peer connection with userId: ${remoteUserId}`);
			peerConnection.close();
			this.peerConnections.delete(remoteUserId);
		}
	}
}
