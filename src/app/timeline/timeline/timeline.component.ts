import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations'; // Added
import { TimelineService } from '../timeline.service';
import { TimelineData, HistoricalPeriod, HistoricalEvent, ThematicGroup } from '../timeline.model';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  animations: [ // Added
    trigger('eventListAnimation', [
      transition('* => *', [ // Animate on any state change of the list
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [ // Stagger delay of 100ms between items
            animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true }) // optional: true if :enter might not find elements (e.g. empty list)
      ])
    ])
  ]
})
export class TimelineComponent implements OnInit {
  periods: HistoricalPeriod[] = [];
  events: HistoricalEvent[] = [];
  groups: ThematicGroup[] = [];
  selectedEvent: HistoricalEvent | null = null;

  public selectedPeriodId: string | number | null = null;
  public activePeriodName: string | null = null;

  constructor(private timelineService: TimelineService) { }

  ngOnInit(): void {
    this.timelineService.getTimelineData().subscribe((data: TimelineData) => {
      this.periods = data.periods;
      this.events = data.events;
      this.groups = data.groups;
    });
  }

  selectPeriod(period: HistoricalPeriod): void {
    if (this.selectedPeriodId === period.id) {
      // If the same period is clicked again, clear the filter
      this.clearPeriodFilter();
    } else {
      this.selectedPeriodId = period.id;
      this.activePeriodName = period.name;
      // Potentially scroll to the events section or top of timeline
      // console.log('Selected period:', period.name);
    }
  }

  clearPeriodFilter(): void {
    this.selectedPeriodId = null;
    this.activePeriodName = null;
    // console.log('Period filter cleared');
  }

  get filteredEvents(): HistoricalEvent[] {
    if (!this.selectedPeriodId) {
      return this.events; // Return all events if no period is selected
    }
    return this.events.filter(event => event.periodId === this.selectedPeriodId);
  }

  selectEvent(event: HistoricalEvent): void {
    this.selectedEvent = event;
    console.log('Selected event:', event); // Optional console log
  }

  clearSelectedEvent(): void {
    this.selectedEvent = null;
  }
}
