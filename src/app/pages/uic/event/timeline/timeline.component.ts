import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService, CoreService } from '@services/core';
import { CataloguesHttpService, EventsHttpService, PlanningsHttpService } from '@services/uic';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReadCatalogueDto, ReadEventDto, ReadPlanningDto } from '@models/uic';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
})

export class TimelineComponent implements OnInit {
  catalogues:ReadCatalogueDto={}
  checked: boolean = true;
  event:ReadEventDto = {}
  events: any[];
  id: string = '';
  loaded$ = this.coreService.loaded$;
  panelHeader: string = 'CALENDARIO DEL ESTUDIANTE';
  planning:ReadPlanningDto = {}
  search: UntypedFormControl = new UntypedFormControl('')

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    private coreService: CoreService,
    private eventsHttpService: EventsHttpService,
    private planningsHttpService: PlanningsHttpService,
    private route: ActivatedRoute,
    private router: Router,

  ){
    this.breadcrumbService.setItems([
      {label: 'Convocatorias', routerLink: ['/uic/plannings']},
      {label: 'Línea de tiempo', routerLink: ['/uic/events/timeline'] }
    ]);
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'CRONOGRAMA';
    }
      this.catalogues = cataloguesHttpService.catalogues
      this.event = eventsHttpService.events
      this.planning = planningsHttpService.plannings
  }

  ngOnInit() {
      this.events = [

      ];
      const planningId = this.route.snapshot.paramMap.get('planningId');
      this.findByPlanningTimeline(0, planningId);
  }

  //Datos buscados por un ID en especifico
    findByPlanningTimeline(page: number = 0, planningId: string = '') {
  const datePipe = new DatePipe('en-US');
  this.eventsHttpService.findByPlanningTimeline(page, this.search.value, planningId).subscribe((events) => {
    this.events = events.map(event => {
      const fechaInicio = datePipe.transform(event.startDate, 'dd/MM/yyyy');
      const fechaFin = datePipe.transform(event.endDate, 'dd/MM/yyyy');
      return {
        sort: event.sort,
        status: `${event.sort}.${event.catalogue.name}`,
        subheader: `Fecha Inicio: ${fechaInicio} | Fecha Fin: ${fechaFin}`,
        content: `${event.catalogue.description}`
      };
    }).sort((a, b) => a.sort - b.sort);
  });
}

   //Funcion para el boton de regreso
    back(): void {
      this.router.navigate(['/uic/plannings']);
  }
}
