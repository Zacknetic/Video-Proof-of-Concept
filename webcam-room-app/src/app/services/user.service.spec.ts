import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve a username', () => {
    const testUsername = 'testUser';
    service.setUsername(testUsername);
    const storedUsername = service.getLocalUser().username;
    expect(storedUsername).toBe(testUsername);
  });

  it('should sanitize the username before storing', () => {
    const unsanitizedUsername = 'test<user>';
    const sanitizedUsername = 'testuser'; // Assuming simple sanitization for demonstration
    service.setUsername(unsanitizedUsername);
    const storedUsername = service.getLocalUser().username;
    expect(storedUsername).toBe(sanitizedUsername);
  });

  it('should verify the username is valid', () => {
    const invalidUsername = ''; // Example of an invalid username
    expect(() => service.setUsername(invalidUsername)).toThrowError('Invalid username');
  });
});
