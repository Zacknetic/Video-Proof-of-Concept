import { Component } from '@angular/core';
import {  RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet],
  providers: []
})
export class AppComponent {
  title = 'webcam-room-app';
}
