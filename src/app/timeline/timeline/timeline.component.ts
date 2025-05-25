import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, QueryList, ViewChildren, Inject, PLATFORM_ID, ViewChild, Renderer2 } from '@angular/core'; // Updated imports
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
export class TimelineComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('eventItemRef') eventItemRefs!: QueryList<ElementRef>;
  @ViewChild('eventsContainerRef') eventsContainerRef!: ElementRef<HTMLDivElement>; // Re-added
  // Removed @ViewChild for scrollDotRef
  private observer!: IntersectionObserver;
  // Removed scrollListenerFn

  periods: HistoricalPeriod[] = [];
  events: HistoricalEvent[] = [];
  groups: ThematicGroup[] = [];
  selectedEvent: HistoricalEvent | null = null;

  public selectedPeriodId: string | number | null = null;
  public activePeriodName: string | null = null;

  public isFiltering: boolean = false; // Added
  public filterProgressBarWidth: number = 0; // Added
  private filterAnimationTimeout: any; // Added

  private eraBackgroundColors: { [key: string]: string } = {
    'p1': '#f0e6d2', 
    'p2': '#e0e0e0', 
    'p3': '#d4e8f0'
  };
  public activeEraBackground: string | null = null;

  constructor(
    private timelineService: TimelineService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2
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
      if (this.eventItemRefs) {
          this.eventItemRefs.changes.subscribe(() => {
              this.disconnectObserver(); // Existing IntersectionObserver cleanup
              this.initObserver(); // Re-init IntersectionObserver
          });
      }

      // Removed Scroll Indicator Logic
    }
  }

  // Removed updateScrollDotPosition method

  private initObserver(): void {
    // No need for isPlatformBrowser check here as it's called from a guarded block
    const options = {
      root: this.eventsContainerRef.nativeElement, // Changed from document.querySelector
      rootMargin: '0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // The console.log was here
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
    // Removed scrollListenerFn call
    if (this.filterAnimationTimeout) {
      clearTimeout(this.filterAnimationTimeout);
    }
  }

  selectPeriod(period: HistoricalPeriod): void {
    // Clear any ongoing filter animation timeout
    if (this.filterAnimationTimeout) {
      clearTimeout(this.filterAnimationTimeout);
    }

    this.activeEraBackground = this.eraBackgroundColors[String(period.id)] || null; // Keep existing bg change

    if (this.selectedPeriodId === period.id) {
      // If clicking the same period, clear filter (which also sets isFiltering = false)
      this.clearPeriodFilter();
    } else {
      this.selectedPeriodId = period.id;
      this.activePeriodName = period.name;

      this.isFiltering = true;      // Show the progress bar track
      this.filterProgressBarWidth = 0; // Reset bar width before animation

      // Use a short timeout to allow the DOM to update and render the bar at 0% width
      // before transitioning to 100%.
      setTimeout(() => {
        this.filterProgressBarWidth = 100; // Trigger animation to 100%
      }, 20); // 20ms should be enough for DOM update

      // Set a timeout to hide the progress bar after animation + some delay
      // Duration should be longer than the CSS transition (0.4s = 400ms)
      this.filterAnimationTimeout = setTimeout(() => {
        this.isFiltering = false;
        // Optionally reset width for next time, though *ngIf handles initial state
        // this.filterProgressBarWidth = 0; 
      }, 700); // e.g., 400ms for animation + 300ms visible at 100%
    }
  }

  clearPeriodFilter(): void {
    this.selectedPeriodId = null;
    this.activePeriodName = null;
    this.activeEraBackground = null;

    // Clear any ongoing filter animation and hide the bar
    if (this.filterAnimationTimeout) {
      clearTimeout(this.filterAnimationTimeout);
    }
    this.isFiltering = false;
    this.filterProgressBarWidth = 0;
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
