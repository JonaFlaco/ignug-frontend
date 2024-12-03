import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit {

  public events: any[];
  public options: any;

  constructor() { }

  ngOnInit() {

    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin,interactionPlugin],
      defaulDate: new Date(),
      header:{
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      editable: false
    }

    this.events = [
      {
        title: "Evento 1",
        date: "2023-02-27",
        description: "Evento 1"
      },
      {
        title: "Evento 2",
        date: "2023-02-28",
        description: "Evento 2"
      },
      {
        title: "Evento 3",
        date: "2023-03-01",
        description: "Evento 3"
      },
    ]


  }

}
