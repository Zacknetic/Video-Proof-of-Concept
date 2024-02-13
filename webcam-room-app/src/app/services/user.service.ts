import { Injectable } from '@angular/core';
import { User } from '../../types/dataTypes';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private localUser: User = { userId: '', username: '' };
	constructor() {}

	setUsername(username: string): void {
		const sanitizedUsername = this.sanitizeUsername(username);
		if (!this.verifyUsername(sanitizedUsername)) {
			throw new Error('Invalid username');
		}
		this.localUser.username = sanitizedUsername;
		this.localUser.userId = this.generateUserId();
	}

	generateUserId(): string {
		return Math.random().toString(36).substr(2, 9);
	}

	getLocalUser(): User {
		return this.localUser;
	}

	private sanitizeUsername(username: string): string {
		// Implement sanitization logic here
		// Simple example: remove special characters
		return username.replace(/[^\w]/gi, '');
	}

	private verifyUsername(username: string): boolean {
		// Implement verification logic here
		// Simple example: ensure username is not empty
		return username.length > 0;
	}
}
