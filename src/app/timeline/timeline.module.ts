import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from './timeline/timeline.component'; // Added import

import { TimelineRoutingModule } from './timeline-routing.module';


@NgModule({
  declarations: [
    TimelineComponent // Added component to declarations
  ],
  imports: [
    CommonModule,
    TimelineRoutingModule
  ],
  exports: [
    TimelineComponent // Added component to exports
  ]
})
export class TimelineModule { }
