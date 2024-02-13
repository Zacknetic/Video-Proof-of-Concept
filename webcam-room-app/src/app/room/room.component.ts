import { Component } from '@angular/core';
import { SignalingService } from '../services/signaling.service';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css',
  providers: [SignalingService],
})
export class RoomComponent {

  constructor(private signalingService: SignalingService) {}

  

}
