// import { TestBed } from '@angular/core/testing';
// import { FormsModule } from '@angular/forms';
// import { RouterTestingModule } from '@angular/router/testing';
// import { LandingPageComponent } from './landing-page.component';
// import { UserService } from '../services/user.service'; // Assuming UserService handles username storage
// import { Router } from '@angular/router';

// describe('LandingPageComponent', () => {
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [
//         FormsModule,
//         RouterTestingModule,
//         LandingPageComponent
//       ],
//       providers: [UserService] // Provide any services your component uses
//     }).compileComponents();
//   });

//   it('should create', () => {
//     const fixture = TestBed.createComponent(LandingPageComponent);
//     const component = fixture.componentInstance;
//     expect(component).toBeTruthy();
//   });

//   it('should have an input for the username and a login button', () => {
//     const fixture = TestBed.createComponent(LandingPageComponent);
//     fixture.detectChanges();
//     const compiled = fixture.nativeElement as HTMLElement;
//     expect(compiled.querySelector('input[type="text"]')).not.toBeNull();
//     expect(compiled.querySelector('button')).not.toBeNull();
//   });
  
//   it('should navigate to the lobby on login', () => {
//     const fixture = TestBed.createComponent(LandingPageComponent);
//     const component = fixture.componentInstance;
//     const router = TestBed.inject(Router);
//     const navigateSpy = spyOn(router, 'navigateByUrl');
  
//     component.username = 'testUser';
//     component.login();
  
//     expect(navigateSpy).toHaveBeenCalledWith('/lobby');
//   });

//   it('should store the username on login', () => {
//     const fixture = TestBed.createComponent(LandingPageComponent);
//     const component = fixture.componentInstance;
//     const userService = TestBed.inject(UserService);
//     const setUserSpy = spyOn(userService, 'setUsername');
  
//     component.username = 'testUser';
//     component.login();
  
//     expect(setUserSpy).toHaveBeenCalledWith('testUser');
//   });
  

//   // Additional tests will go here
// });
