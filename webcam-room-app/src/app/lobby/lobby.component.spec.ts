import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LobbyComponent } from './lobby.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RoomService } from '../services/room.service';
import { of } from 'rxjs';

describe('LobbyComponent', () => {
  let component: LobbyComponent;
  let fixture: ComponentFixture<LobbyComponent>;
  let mockRoomService;

  beforeEach(async () => {
    // Mock RoomService
    mockRoomService = jasmine.createSpyObj('RoomService', ['getRooms']);
    const mockRooms = of([{ id: 1, name: 'Test Room', users: ['User1', 'User2'] }]);

    mockRoomService.getRooms.and.returnValue(mockRooms);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, LobbyComponent],
      providers: [{ provide: RoomService, useValue: mockRoomService }]
    }).compileComponents();

    fixture = TestBed.createComponent(LobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display rooms', () => {
    // This test might need adjustment based on how you implement the fetching and display of rooms
    component.rooms$.subscribe(rooms => {
      expect(rooms.length).toBeGreaterThan(0);
      expect(rooms[0].name).toEqual('Test Room');
    });
    expect(mockRoomService.getRooms).toHaveBeenCalled();
  });

  it('should have a uniform grid for rooms', () => {
    // This is more about checking the presence of CSS classes or styles that define a grid, so adjust accordingly
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.grid-container')).not.toBeNull();
  });

  // Additional tests for navigation and interaction can be added here
});
