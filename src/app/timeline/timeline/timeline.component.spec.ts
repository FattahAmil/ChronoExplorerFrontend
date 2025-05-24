import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common'; // Required for *ngFor, *ngIf, DatePipe
import { Observable, of } from 'rxjs';

import { TimelineComponent } from './timeline.component';
import { TimelineService } from '../timeline.service';
import { TimelineData, HistoricalEvent, HistoricalPeriod, ThematicGroup } from '../timeline.model';

// 1. Updated Mock Data for Filtering Tests
const mockTimelineData: TimelineData = {
  periods: [
    { id: 'p1', name: 'Period One', startDate: '1000-01-01', endDate: '1099-01-01', color: '#FF0000' },
    { id: 'p2', name: 'Period Two', startDate: '1100-01-01', endDate: '1199-01-01', color: '#00FF00' },
    { id: 'p3', name: 'Period Three (No Events)', startDate: '1300-01-01', endDate: '1399-01-01', color: '#0000FF' }
  ],
  events: [
    { id: 'e1', title: 'Event 1 P1', date: '1050-01-01', summary: 'S1', detailedDescription: 'D1', periodId: 'p1' },
    { id: 'e2', title: 'Event 2 P1', date: '1070-01-01', summary: 'S2', detailedDescription: 'D2', periodId: 'p1' },
    { id: 'e3', title: 'Event 1 P2', date: '1150-01-01', summary: 'S3', detailedDescription: 'D3', periodId: 'p2' },
    { id: 'e4', title: 'Event No Period', date: '1250-01-01', summary: 'S4', detailedDescription: 'D4' } // Event without periodId
  ],
  groups: [{ id: 'g1', name: 'Group 1', description: 'Test Group 1' }]
};

const mockTimelineService = {
  // Use a function to return a deep copy to prevent tests from interfering with each other
  getTimelineData: (): Observable<TimelineData> => of(JSON.parse(JSON.stringify(mockTimelineData)))
};

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimelineComponent],
      imports: [CommonModule],
      providers: [
        { provide: TimelineService, useValue: mockTimelineService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers ngOnInit, loading initial data
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should load timeline data on init', () => {
      expect(component.periods.length).toBe(mockTimelineData.periods.length);
      expect(component.events.length).toBe(mockTimelineData.events.length);
      expect(component.groups.length).toBe(mockTimelineData.groups.length);
      
      expect(component.periods[0].name).toBe(mockTimelineData.periods[0].name);
      expect(component.events[0].title).toBe(mockTimelineData.events[0].title);
    });
  });

  // New Describe block for Period Filtering
  describe('Period Filtering', () => {
    describe('#selectPeriod()', () => {
      it('should set selectedPeriodId and activePeriodName when selectPeriod is called', () => {
        const testPeriod: HistoricalPeriod | undefined = component.periods.find(p => p.id === 'p1');
        if (!testPeriod) {
          fail('Test setup error: Period p1 not found');
          return;
        }
        component.selectPeriod(testPeriod);
        expect(component.selectedPeriodId).toBe(testPeriod.id);
        expect(component.activePeriodName).toBe(testPeriod.name);
      });

      it('should clear filter if selectPeriod is called with the currently active period', () => {
        const testPeriod: HistoricalPeriod | undefined = component.periods.find(p => p.id === 'p1');
        if (!testPeriod) {
          fail('Test setup error: Period p1 not found');
          return;
        }
        component.selectPeriod(testPeriod); // Select first
        component.selectPeriod(testPeriod); // Select again
        expect(component.selectedPeriodId).toBeNull();
        expect(component.activePeriodName).toBeNull();
      });
    });

    describe('#clearPeriodFilter()', () => {
      it('should clear selectedPeriodId and activePeriodName when clearPeriodFilter is called', () => {
        component.selectedPeriodId = 'p1'; // Manually set a filter
        component.activePeriodName = 'Some Period';
        component.clearPeriodFilter();
        expect(component.selectedPeriodId).toBeNull();
        expect(component.activePeriodName).toBeNull();
      });
    });

    describe('#filteredEvents getter', () => {
      it('should return all events when no period is selected', () => {
        component.selectedPeriodId = null; // Ensure no filter
        expect(component.filteredEvents.length).toBe(mockTimelineData.events.length);
      });

      it('should return only events for the selected period (p1)', () => {
        const targetPeriodId = 'p1';
        const targetPeriod = component.periods.find(p => p.id === targetPeriodId);
        if (!targetPeriod) {
          fail('Test setup error: Target period p1 not found in component.periods');
          return;
        }
        component.selectPeriod(targetPeriod);

        const expectedEvents = mockTimelineData.events.filter(event => event.periodId === targetPeriodId);
        expect(component.filteredEvents.length).toBe(expectedEvents.length);
        component.filteredEvents.forEach(event => {
          expect(event.periodId).toBe(targetPeriodId);
        });
        expect(component.filteredEvents.every(event => event.title.includes('P1'))).toBeTrue();
      });
      
      it('should return only events for the selected period (p2)', () => {
        const targetPeriodId = 'p2';
        const targetPeriod = component.periods.find(p => p.id === targetPeriodId);
        if (!targetPeriod) {
          fail('Test setup error: Target period p2 not found in component.periods');
          return;
        }
        component.selectPeriod(targetPeriod);

        const expectedEvents = mockTimelineData.events.filter(event => event.periodId === targetPeriodId);
        expect(component.filteredEvents.length).toBe(expectedEvents.length);
        component.filteredEvents.forEach(event => {
          expect(event.periodId).toBe(targetPeriodId);
        });
        expect(component.filteredEvents.every(event => event.title.includes('P2'))).toBeTrue();
      });

      it('should return empty array if selected period has no events', () => {
        const periodWithNoEvents = component.periods.find(p => p.id === 'p3'); // p3 is defined in mock data
         if (!periodWithNoEvents) {
          fail('Test setup error: Target period p3 not found in component.periods');
          return;
        }
        component.selectPeriod(periodWithNoEvents);
        expect(component.filteredEvents.length).toBe(0);
      });
    });
  });

  // Existing tests for Event Selection and Template Rendering remain below
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
      component.selectedEvent = initialEvent; 
      component.clearSelectedEvent();
      expect(component.selectedEvent).toBeNull();
    });
  });

  describe('Template Rendering', () => {
    it('should display period names in the template', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.period-item h3')?.textContent).toContain(mockTimelineData.periods[0].name);
    });

    it('should display event titles in the template when no filter is active', () => {
      component.clearPeriodFilter(); // Ensure no filter
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      // Check for any event title from the initial unfiltered list
      expect(compiled.querySelector('.event-item .event-title')?.textContent).toContain(mockTimelineData.events[0].title);
    });
    
    it('should display filtered event titles in the template when a filter is active', () => {
        const targetPeriodId = 'p1';
        const targetPeriod = component.periods.find(p => p.id === targetPeriodId);
        if (!targetPeriod) {
          fail('Test setup error: Target period p1 not found in component.periods');
          return;
        }
        component.selectPeriod(targetPeriod);
        fixture.detectChanges(); // Re-render with filteredEvents

        const compiled = fixture.nativeElement as HTMLElement;
        const eventTitles = compiled.querySelectorAll('.event-item .event-title');
        expect(eventTitles.length).toBe(mockTimelineData.events.filter(e => e.periodId === targetPeriodId).length);
        eventTitles.forEach(titleElement => {
            // Check if the event title belongs to an event from period 'p1'
            const eventExistsInP1 = mockTimelineData.events.some(event => event.periodId === targetPeriodId && event.title === titleElement.textContent);
            expect(eventExistsInP1).toBeTrue(`Event title "${titleElement.textContent}" should belong to period ${targetPeriodId}`);
        });
    });


    it('should show event detail view when an event is selected and hide it when cleared', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.event-detail-view')).toBeFalsy("Detail view should not be present initially");

      const testEvent: HistoricalEvent = component.events[0];
      component.selectEvent(testEvent);
      fixture.detectChanges(); 

      const detailView = compiled.querySelector('.event-detail-view');
      expect(detailView).toBeTruthy("Detail view should be present after selection");
      expect(detailView?.querySelector('h2')?.textContent).toContain(testEvent.title);

      component.clearSelectedEvent();
      fixture.detectChanges(); 
      expect(compiled.querySelector('.event-detail-view')).toBeFalsy("Detail view should be gone after clearing");
    });

    it('should have a close button in the detail view that calls clearSelectedEvent when clicked', () => {
        const testEvent: HistoricalEvent = component.events[0];
        component.selectEvent(testEvent);
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const closeButton = compiled.querySelector('.event-detail-view .close-button') as HTMLButtonElement;
        expect(closeButton).toBeTruthy("Close button should be present in detail view");

        spyOn(component, 'clearSelectedEvent').and.callThrough(); 
        
        closeButton.click(); 

        expect(component.clearSelectedEvent).toHaveBeenCalled();
        expect(component.selectedEvent).toBeNull("selectedEvent should be null after close button click"); 
        
        fixture.detectChanges(); 
        expect(compiled.querySelector('.event-detail-view')).toBeFalsy("Detail view should be gone after close button click");
    });
  });
});
