import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VideoService } from '../services/video.service';
import { RoomService } from '../services/room.service'; // Assume this service exists
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-lobby',
	templateUrl: './lobby.component.html',
	styleUrls: ['./lobby.component.css'],
	standalone: true,
	imports: [FormsModule], // Import any required modules or components
	providers: [VideoService], // This might not be necessary if provided in root
})
export class LobbyComponent {
	newRoomName: string = ''; // Model for the new room name input
	private localStream!: MediaStream;

	constructor(
		private videoService: VideoService,
		private roomService: RoomService, // Inject RoomService
		private router: Router
	) {}

	ngOnInit(): void {
		this.videoService.getLocalStream().then((stream) => {
			this.localStream = stream;
			// Display the stream in a video element
			const videoElement = document.createElement('video');
			videoElement.srcObject = stream;
		});
	}

	createAndEnterRoom(): void {
		if (!this.newRoomName.trim()) {
			alert('Please enter a room name');
			return;
		}
		// Assume RoomService has a method to create or validate the room existence
		const roomId = this.roomService.setCurrentRoom(this.newRoomName);
		this.navigateToRoom(roomId); // Navigate to the newly created or validated room
	}

  navigateToRoom(roomId: string): void {
    this.router.navigate(['/room', roomId]);
  }
}
