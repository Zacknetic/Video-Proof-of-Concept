import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component'; // Adjust the path as necessary
import { LobbyComponent } from './lobby/lobby.component';
import { RoomComponent } from './room/room.component';

export const appRoutes: Routes = [
  { path: '', component: LandingPageComponent, title: 'Landing Page' },
  { path: 'lobby', component: LobbyComponent, title: 'Lobby' },
  { path: 'room', component: RoomComponent, title: 'Room' }
];
