import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common'; // Required for *ngFor, *ngIf, DatePipe
import { Observable, of } from 'rxjs';

import { TimelineComponent } from './timeline.component';
import { TimelineService } from '../timeline.service';
import { TimelineData, HistoricalEvent, HistoricalPeriod, ThematicGroup } from '../timeline.model';

// 1. Setup TestBed: Create a mock TimelineService
const mockTimelineData: TimelineData = {
  periods: [{ id: 'p1', name: 'Ancient Times', startDate: '1000-01-01', endDate: '1200-01-01', color: '#FF0000' }],
  events: [{ id: 'e1', title: 'Test Event 1', date: '1100-01-01', summary: 'Summary 1', detailedDescription: 'Detail 1', imageUrl: 'test.jpg' }],
  groups: [{ id: 'g1', name: 'Group 1', description: 'Test Group 1' }]
};

const mockTimelineService = {
  getTimelineData: (): Observable<TimelineData> => of(JSON.parse(JSON.stringify(mockTimelineData))) // Deep copy to avoid test interference
};

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  // 2. Configure TestBed
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimelineComponent],
      imports: [CommonModule], // For template directives and pipes
      providers: [
        { provide: TimelineService, useValue: mockTimelineService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // This triggers ngOnInit and initial data binding
  });

  // 3. Basic Component Tests
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // 4. Test Data Loading (ngOnInit)
  describe('#ngOnInit', () => {
    it('should load timeline data on init', () => {
      expect(component.periods.length).toBeGreaterThan(0);
      expect(component.events.length).toBeGreaterThan(0);
      expect(component.groups.length).toBeGreaterThan(0);
      
      expect(component.periods[0].name).toBe(mockTimelineData.periods[0].name);
      expect(component.events[0].title).toBe(mockTimelineData.events[0].title);
      expect(component.groups[0].name).toBe(mockTimelineData.groups[0].name);
    });
  });

  // 5. Test Event Selection (selectEvent and clearSelectedEvent)
  describe('Event Selection', () => {
    it('should select an event when selectEvent is called', () => {
      const testEvent: HistoricalEvent = { 
        id: 'e2', 
        title: 'Test Event 2', 
        date: '1200-01-01', 
        summary: 'Summary 2', 
        detailedDescription: 'Detail 2' 
      };
      component.selectEvent(testEvent);
      expect(component.selectedEvent).toBe(testEvent);
    });

    it('should clear selected event when clearSelectedEvent is called', () => {
      const initialEvent: HistoricalEvent = { 
        id: 'e3', 
        title: 'Test Event 3', 
        date: '1300-01-01', 
        summary: 'Summary 3', 
        detailedDescription: 'Detail 3'
      };
      component.selectedEvent = initialEvent; // Set an event first
      // fixture.detectChanges(); // Not strictly needed here as it doesn't affect component property directly

      component.clearSelectedEvent();
      expect(component.selectedEvent).toBeNull();
    });
  });

  // 6. Test Template Rendering
  describe('Template Rendering', () => {
    it('should display period names in the template', () => {
      // fixture.detectChanges(); // Already called in beforeEach, data should be bound
      const compiled = fixture.nativeElement as HTMLElement;
      // Note: The querySelector needs to match your HTML structure.
      expect(compiled.querySelector('.period-item h3')?.textContent).toContain(mockTimelineData.periods[0].name);
    });

    it('should display event titles in the template', () => {
      // fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.event-item .event-title')?.textContent).toContain(mockTimelineData.events[0].title);
    });

    it('should show event detail view when an event is selected and hide it when cleared', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      // Initially, detail view should not be present due to *ngIf="selectedEvent"
      expect(compiled.querySelector('.event-detail-view')).toBeFalsy("Detail view should not be present initially");

      const testEvent: HistoricalEvent = component.events[0]; // Use an event from loaded data
      component.selectEvent(testEvent);
      fixture.detectChanges(); // Update view to reflect selectedEvent

      const detailView = compiled.querySelector('.event-detail-view');
      expect(detailView).toBeTruthy("Detail view should be present after selection");
      expect(detailView?.querySelector('h2')?.textContent).toContain(testEvent.title);

      // Test clearing the selection
      component.clearSelectedEvent();
      fixture.detectChanges(); // Update view
      expect(compiled.querySelector('.event-detail-view')).toBeFalsy("Detail view should be gone after clearing");
    });

    it('should have a close button in the detail view that calls clearSelectedEvent when clicked', () => {
        // Select an event to show the detail view
        const testEvent: HistoricalEvent = component.events[0];
        component.selectEvent(testEvent);
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const closeButton = compiled.querySelector('.event-detail-view .close-button') as HTMLButtonElement;
        expect(closeButton).toBeTruthy("Close button should be present in detail view");

        // Spy on clearSelectedEvent to ensure it's called
        spyOn(component, 'clearSelectedEvent').and.callThrough(); // Spy on the actual method
        
        closeButton.click(); // Simulate user click
        // fixture.detectChanges(); // Not always needed after click if the method itself changes state sufficiently for expect

        expect(component.clearSelectedEvent).toHaveBeenCalled();
        expect(component.selectedEvent).toBeNull("selectedEvent should be null after close button click"); 
        
        fixture.detectChanges(); // To update the DOM based on selectedEvent becoming null
        expect(compiled.querySelector('.event-detail-view')).toBeFalsy("Detail view should be gone after close button click");
    });
  });
});
