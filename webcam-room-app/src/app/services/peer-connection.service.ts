import { Injectable } from '@angular/core';
import { VideoService } from './video.service';
import { UserService } from './user.service';
import { PeerInfo, SignalingData, User } from '../../types/dataTypes';

@Injectable({
	providedIn: 'root',
})
export class PeerConnectionService {
	private peerConnections: Map<string, PeerInfo> = new Map();

	constructor(
		private videoService: VideoService,
		private userService: UserService,
	) {}

	public async createPeerConnection(remoteUser: User) {
		if (this.userService.getLocalUser().userId === remoteUser.userId)
			throw new Error('Cannot create peer connection with self');
		if (this.peerConnections.has(remoteUser.userId))
			throw new Error('Peer connection already exists');

		console.log(
			`Creating peer connection with ${remoteUser.username} (${remoteUser.userId})`
		);

		const peerConnection: RTCPeerConnection = new RTCPeerConnection({
			iceServers: [
				{
					urls: ['turn:192.168.50.12:3478'], // TURN server's address
					username: 'exampleUser', // TURN server username
					credential: 'examplePassword', // TURN server password
				},
			],
		});

		const localStream: MediaStream = await this.videoService.getLocalStream();
		localStream.getTracks().forEach((track) => {
			peerConnection.addTrack(track, localStream);
		});

		peerConnection.ontrack = (event) => {
			console.log(
				`Received remote track from ${remoteUser.username} (${remoteUser.userId})`
			);
			if (!event.streams || event.streams[0]) {
				console.warn('No remote stream found');
			} else this.videoService.addVideoStream(event.streams[0], remoteUser);
		};
	}

	public async closePeerConnectionWithUser(remoteUser: User) {
		console.log(
			`Closing peer connection with ${remoteUser.username} (${remoteUser.userId})`
		);
		const peerConnection: PeerInfo | undefined = this.peerConnections.get(
			remoteUser.userId
		);
		if (peerConnection) {
			peerConnection.peerConnection.close();
			this.peerConnections.delete(remoteUser.userId);
		}
	}

	public getPeerConnection(remoteUser: User): RTCPeerConnection {
		let peerConnection: PeerInfo | undefined = this.peerConnections.get(
			remoteUser.userId
		);

		if (!peerConnection) this.createPeerConnection(remoteUser);

		return this.peerConnections.get(remoteUser.userId)!.peerConnection;
	}
}
