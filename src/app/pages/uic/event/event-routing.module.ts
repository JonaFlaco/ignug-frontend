import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EventComponent} from './event.component';
import {EventFormComponent} from './event-form/event-form.component';
import {ExitGuard} from '@shared/guards';
import { CalendarComponent } from './calendar/calendar.component';
import { TimelineComponent } from './timeline/timeline.component';

const routes: Routes = [
  {
    path: 'timeline/:planningId',
    component: TimelineComponent,
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    canDeactivate: [ExitGuard]
  },
  {
    path: '',
    component: EventComponent
  },
  {
    path: ':id',
    component: EventFormComponent,
    canDeactivate: [ExitGuard]
  },
  {
    path: 'plannings/:planningId',
    component: EventComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule {
}
