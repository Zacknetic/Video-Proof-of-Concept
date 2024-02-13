import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SignalingService } from '../services/signaling.service';
import { VideoService } from '../services/video.service';
import { Room } from '../../types/dataTypes';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
  standalone: true,
  imports: [], // Import any required modules or components
  providers: [VideoService, SignalingService] // This might not be necessary if provided in root
})
export class LobbyComponent {
  // rooms$: Observable<Room[]>;
  private localStream!: MediaStream;
  
  constructor(private videoService: VideoService, private signalingService: SignalingService, private router: Router) {
    videoService.getLocalStream().then((stream) => {
      this.localStream = stream;
    })

    signalingService.initializeSignaling();

    // this.rooms$ = of(this.signalingService.getRooms());
  }

  navigateToRoom(roomId: number): void {
    this.router.navigate(['/room', roomId]);
  }
}
