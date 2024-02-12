import { LandingPageComponent } from './landing-page/landing-page.component';
import { LobbyComponent } from './lobby/lobby.component';
import { RoomComponent } from './room/room.component';

export const appRoutes = [
  { path: '', component: LandingPageComponent, title: 'Landing Page' },
  { path: 'lobby', component: LobbyComponent, title: 'Lobby' },
  { path: 'room/:id', component: RoomComponent, title: 'Room' },
];
