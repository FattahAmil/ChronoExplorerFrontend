import { TestBed } from '@angular/core/testing';
import { TimelineService } from './timeline.service';
import { TimelineData, HistoricalPeriod, HistoricalEvent, ThematicGroup } from './timeline.model'; // Import models for type checking

describe('TimelineService', () => {
  let service: TimelineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimelineService] // Provide the service to TestBed
    });
    service = TestBed.inject(TimelineService); // Inject the service
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getTimelineData', () => {
    it('should return an Observable<TimelineData> that emits data', (done: DoneFn) => {
      service.getTimelineData().subscribe((data: TimelineData) => {
        // Check if data is truthy (not null, undefined, etc.)
        expect(data).toBeTruthy();
        done(); // Signal async test completion
      });
    });

    it('should return data with defined periods, events, and groups arrays', (done: DoneFn) => {
      service.getTimelineData().subscribe((data: TimelineData) => {
        expect(data.periods).toBeDefined("Periods array should be defined");
        expect(data.events).toBeDefined("Events array should be defined");
        expect(data.groups).toBeDefined("Groups array should be defined");

        // Check if they are arrays
        expect(Array.isArray(data.periods)).toBe(true, "Periods should be an array");
        expect(Array.isArray(data.events)).toBe(true, "Events should be an array");
        expect(Array.isArray(data.groups)).toBe(true, "Groups should be an array");
        done();
      });
    });

    it('should return mock data with at least one period and expected structure', (done: DoneFn) => {
      service.getTimelineData().subscribe((data: TimelineData) => {
        expect(data.periods.length).toBeGreaterThan(0, "Should have at least one period");
        const firstPeriod: HistoricalPeriod = data.periods[0];
        expect(firstPeriod.id).toBeDefined("Period id should be defined");
        expect(firstPeriod.name).toBeDefined("Period name should be defined");
        expect(firstPeriod.startDate).toBeDefined("Period startDate should be defined");
        expect(firstPeriod.endDate).toBeDefined("Period endDate should be defined");
        expect(firstPeriod.color).toBeDefined("Period color should be defined");
        
        // Example check for a specific value from mock data in TimelineService
        expect(data.periods[0].name).toEqual('Ancient Times');
        done();
      });
    });

    it('should return mock data with at least one event and expected structure', (done: DoneFn) => {
      service.getTimelineData().subscribe((data: TimelineData) => {
        expect(data.events.length).toBeGreaterThan(0, "Should have at least one event");
        const firstEvent: HistoricalEvent = data.events[0];
        expect(firstEvent.id).toBeDefined("Event id should be defined");
        expect(firstEvent.date).toBeDefined("Event date should be defined");
        expect(firstEvent.title).toBeDefined("Event title should be defined");
        expect(firstEvent.summary).toBeDefined("Event summary should be defined");
        expect(firstEvent.detailedDescription).toBeDefined("Event detailedDescription should be defined");

        // Example check for a specific value from mock data in TimelineService
        expect(data.events[0].title).toEqual('Colosseum Construction Begins');
        done();
      });
    });

    it('should return mock data with at least one group and expected structure', (done: DoneFn) => {
      service.getTimelineData().subscribe((data: TimelineData) => {
        expect(data.groups.length).toBeGreaterThan(0, "Should have at least one group");
        const firstGroup: ThematicGroup = data.groups[0];
        expect(firstGroup.id).toBeDefined("Group id should be defined");
        expect(firstGroup.name).toBeDefined("Group name should be defined");

        // Example check for a specific value from mock data in TimelineService
        expect(data.groups[0].name).toEqual('Warfare & Conquests');
        done();
      });
    });
  });
});
