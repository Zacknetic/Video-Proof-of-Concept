import { TestBed } from '@angular/core/testing';

import { SignalingService } from './signaling.service';

describe('SignalingService', () => {
  let service: SignalingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a method to connect to the signaling server', () => {
    expect(service.connect).toBeDefined();
  });

  it('should have a method to disconnect from the signaling server', () => {
    expect(service.disconnect).toBeDefined();
  });

  it('should have a method to send a message to the signaling server', () => {
    expect(service.send).toBeDefined();
  });

  it('should have a method to receive messages from the signaling server', () => {
    expect(service.onMessage).toBeDefined();
  });

  it('should have a method to handle errors from the signaling server', () => {
    expect(service.onError).toBeDefined();
  });

  it('should have a method to get available rooms from the signaling server', () => {
    expect(service.getRooms).toBeDefined();
  });
});
