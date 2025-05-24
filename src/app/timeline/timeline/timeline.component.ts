import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineService } from '../timeline.service';
import { TimelineData, HistoricalPeriod, HistoricalEvent, ThematicGroup } from '../timeline.model';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
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
