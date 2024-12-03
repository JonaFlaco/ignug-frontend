import {AuthService} from '@services/auth';
import {ActivatedRoute,Router} from '@angular/router';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {ColumnModel, PaginatorModel} from '@models/core';
import {Component, OnInit} from '@angular/core';
import {debounceTime} from "rxjs";
import {EventsHttpService, PlanningsHttpService} from '@services/uic';
import {EventModel, ReadPlanningDto, SelectEventDto} from '@models/uic';
import {MenuItem} from "primeng/api";
import {UntypedFormControl} from "@angular/forms";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  actionButtons: MenuItem[] = [];
  columns: ColumnModel[];
  events: EventModel[] = [];
  loaded$ = this.coreService.loaded$;
  planning:ReadPlanningDto = {}
  pagination$ = this.eventsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedEvents: EventModel[] = [];
  selectedEvent: SelectEventDto = {};

  constructor(
    public authService: AuthService,
    public messageService: MessageService,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private eventsHttpService: EventsHttpService,
    private planningsHttpService: PlanningsHttpService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Convocatorias', routerLink: ['/uic/plannings']},
      {label: 'Asignacion de fases'}
    ]);
    this.actionButtons = this.getActionButtons();
    this.columns = this.getColumns();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.planning = planningsHttpService.plannings
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  //Busqueda por ID
  ngOnInit(): void {
    const planningId = this.route.snapshot.paramMap.get('planningId');
    this.findByPlanning(0, planningId);
  }

  //Metodos Find
  findAll(page: number = 0) {
    this.eventsHttpService.findAll(page, this.search.value).subscribe((events) => this.events = events);
  }

  findByPlanning(page: number = 0,planningId:string = '') {
    this.eventsHttpService.findByPlanning(page, this.search.value,planningId).subscribe((events) => this.events = events);
  }

  //Campos
  getColumns(): ColumnModel[] {
    return [
      {field: 'sort', header: 'Orden'},
      {field: 'catalogue', header: 'Nombre'},
      {field: 'planning', header: 'Convocatoria'},
      {field: 'startDate', header: 'Fecha de inicio'},
      {field: 'endDate', header: 'Fecha fin'},
      {field: 'isEnable', header: 'Estado'},
    ]
  }

  //Botones Actualizar & Eliminar
  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedEvent.id)
            this.redirectEditForm(this.selectedEvent.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedEvent.id)
            this.remove(this.selectedEvent.id);
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  //Rutas
  redirectCreateForm() {
    this.router.navigate(['/uic/events', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/events', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.eventsHttpService.remove(id).subscribe((event) => {
            this.events = this.events.filter(item => item.id !== event.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  //Funcion Eliminar
  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.eventsHttpService.removeAll(this.selectedEvents).subscribe((events) => {
          this.selectedEvents.forEach(eventDeleted => {
            this.events = this.events.filter(event => event.id !== eventDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedEvents = [];
        });
      }
    });
  }

  checkState(event: EventModel): string {
    if (event.isEnable) return 'success';

    return 'danger';
    }

  selectEvent(event: EventModel) {
    this.selectedEvent = event;
  }

}
