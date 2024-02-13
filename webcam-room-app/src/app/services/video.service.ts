import { Injectable } from '@angular/core';
import { User } from '../../types/dataTypes';
import { UserService } from './user.service';

@Injectable({
	providedIn: 'root',
})
export class VideoService {
	private localStream!: MediaStream;
	constructor(private userService: UserService) {}

	onInit(): void {
		this.getLocalStream().then((stream) => {
			this.localStream = stream;
		});
	}

	public async getLocalStream(): Promise<MediaStream> {
		let localStream: MediaStream = this.localStream;

		if (!localStream) {
			localStream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});

      this.addVideoStream(localStream, this.userService.getLocalUser());
		}

		return Promise.resolve(localStream);
	}

	public addVideoStream(stream: MediaStream, remoteUser: User) {
		const videoElement: HTMLVideoElement = document.createElement('video');
		videoElement.srcObject = stream;
		videoElement.autoplay = true;
		videoElement.playsInline = true;
		videoElement.muted = false;
		videoElement.controls = true;
		videoElement.id = `remoteVideo_${remoteUser.userId}`;
		document.getElementById('remoteVideos')?.appendChild(videoElement);
	}
}
