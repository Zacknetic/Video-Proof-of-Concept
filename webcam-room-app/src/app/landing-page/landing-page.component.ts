import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  standalone: true,
  imports: [FormsModule, RouterModule],
})
export class LandingPageComponent {
  username: string = '';

  constructor(private userService: UserService, private router: Router) {}

  login(): void {
    if (this.username) {
      this.userService.setUsername(this.username);
      this.router.navigateByUrl('/lobby'); // Adjusted for standalone component routing
    }
  }
}
