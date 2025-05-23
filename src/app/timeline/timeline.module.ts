import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Removed import for TimelineComponent as it's now standalone

import { TimelineRoutingModule } from './timeline-routing.module';


@NgModule({
  declarations: [
    // TimelineComponent removed from declarations
  ],
  imports: [
    CommonModule,
    TimelineRoutingModule
    // If TimelineComponent were used in templates within this module (unlikely for routed components),
    // it would be imported here: TimelineComponent
  ],
  exports: [
    // TimelineComponent removed from exports
  ]
})
export class TimelineModule { }
