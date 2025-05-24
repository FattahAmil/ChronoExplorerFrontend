import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, QueryList, ViewChildren, Inject, PLATFORM_ID } from '@angular/core'; // Updated imports
import { CommonModule, isPlatformBrowser } from '@angular/common'; // Added isPlatformBrowser
// Removed Angular Animation imports
import { TimelineService } from '../timeline.service';
import { TimelineData, HistoricalPeriod, HistoricalEvent, ThematicGroup } from '../timeline.model';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  // Removed animations metadata
})
export class TimelineComponent implements OnInit, AfterViewInit, OnDestroy { // Implemented interfaces
  @ViewChildren('eventItemRef') eventItemRefs!: QueryList<ElementRef>; // Added ViewChildren
  private observer!: IntersectionObserver; // Added observer property

  periods: HistoricalPeriod[] = [];
  events: HistoricalEvent[] = [];
  groups: ThematicGroup[] = [];
  selectedEvent: HistoricalEvent | null = null;

  public selectedPeriodId: string | number | null = null;
  public activePeriodName: string | null = null;

  private eraBackgroundColors: { [key: string]: string } = {
    'p1': '#f0e6d2', 
    'p2': '#e0e0e0', 
    'p3': '#d4e8f0'
  };
  public activeEraBackground: string | null = null;

  constructor(
    private timelineService: TimelineService,
    @Inject(PLATFORM_ID) private platformId: Object // Added PLATFORM_ID injection
  ) { }

  ngOnInit(): void {
    this.timelineService.getTimelineData().subscribe((data: TimelineData) => {
      this.periods = data.periods;
      this.events = data.events;
      this.groups = data.groups;
      // Data is loaded, if eventItemRefs were already available, we might initObserver here or in ngAfterViewInit
      // For simplicity and to ensure DOM elements are ready, ngAfterViewInit is better.
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) { // Guard added
      this.initObserver();
      // It's important that eventItemRefs.changes subscription is also guarded
      if (this.eventItemRefs) { // Check if eventItemRefs is available
          this.eventItemRefs.changes.subscribe(() => {
              this.disconnectObserver();
              this.initObserver(); 
          });
      }
    }
  }

  private initObserver(): void {
    // No need for isPlatformBrowser check here as it's called from a guarded block
    const options = {
      root: document.querySelector('.events-container'),
      rootMargin: '0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    // Ensure eventItemRefs is defined and has items before trying to observe
    if (this.eventItemRefs) {
        this.eventItemRefs.forEach(itemRef => {
            if (itemRef.nativeElement) {
            this.observer.observe(itemRef.nativeElement);
            }
        });
    }
  }

  private disconnectObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  ngOnDestroy(): void {
    this.disconnectObserver();
  }

  selectPeriod(period: HistoricalPeriod): void {
    if (this.selectedPeriodId === period.id) {
      this.clearPeriodFilter(); // This will also reset activeEraBackground
    } else {
      this.selectedPeriodId = period.id;
      this.activePeriodName = period.name;
      this.activeEraBackground = this.eraBackgroundColors[String(period.id)] || null; // Set specific color or null
    }
  }

  clearPeriodFilter(): void {
    this.selectedPeriodId = null;
    this.activePeriodName = null;
    this.activeEraBackground = null; // Reset to default
  }

  get filteredEvents(): HistoricalEvent[] {
    if (!this.selectedPeriodId) {
      return this.events;
    }
    return this.events.filter(event => event.periodId === this.selectedPeriodId);
  }

  selectEvent(event: HistoricalEvent): void {
    this.selectedEvent = event;
    console.log('Selected event:', event);
  }

  clearSelectedEvent(): void {
    this.selectedEvent = null;
  }

  selectNextEvent(): void {
    if (!this.selectedEvent) return;

    const currentIndex = this.filteredEvents.findIndex(event => event.id === this.selectedEvent!.id);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % this.filteredEvents.length; // Loop to start
      this.selectEvent(this.filteredEvents[nextIndex]);
    }
  }

  selectPreviousEvent(): void {
    if (!this.selectedEvent) return;

    const currentIndex = this.filteredEvents.findIndex(event => event.id === this.selectedEvent!.id);
    if (currentIndex !== -1) {
      let prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = this.filteredEvents.length - 1; // Loop to end
      }
      this.selectEvent(this.filteredEvents[prevIndex]);
    }
  }

  get hasNextEvent(): boolean {
    return this.filteredEvents.length > 1; // Always true if looping and more than 1 event
  }

  get hasPreviousEvent(): boolean {
    return this.filteredEvents.length > 1; // Always true if looping and more than 1 event
  }
}
