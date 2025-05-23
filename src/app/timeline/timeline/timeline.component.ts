import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Added
import { TimelineService } from '../timeline.service';
import { TimelineData, HistoricalPeriod, HistoricalEvent, ThematicGroup } from '../timeline.model';

@Component({
  selector: 'app-timeline',
  standalone: true, // Added
  imports: [CommonModule], // Added
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  periods: HistoricalPeriod[] = [];
  events: HistoricalEvent[] = [];
  groups: ThematicGroup[] = [];
  selectedEvent: HistoricalEvent | null = null;

  constructor(private timelineService: TimelineService) { }

  ngOnInit(): void {
    this.timelineService.getTimelineData().subscribe((data: TimelineData) => {
      this.periods = data.periods;
      this.events = data.events;
      this.groups = data.groups;
    });
  }

  selectEvent(event: HistoricalEvent): void {
    this.selectedEvent = event;
    console.log('Selected event:', event); // Optional console log
  }

  clearSelectedEvent(): void {
    this.selectedEvent = null;
  }
}
