import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CatalogueModel, EventModel, PlanningModel, ReadPlanningDto} from '@models/uic';
import {CataloguesHttpService, PlanningsHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import {EventsHttpService} from '@services/uic';
import {CreateEventDto, UpdateEventDto} from '@models/uic';
import {CatalogueTypeEnum} from '@shared/enums';
import {PlanningTypeEnum} from '@shared/enums/planning.enum';
import {format} from 'date-fns';
import {DateValidators} from '@shared/validators';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventFormComponent implements OnInit, OnExitInterface {
  eventSorts: number[] = [];
  bloodTypes: CatalogueModel[] = [];
  catalogue: CatalogueModel[] = [];
  catalogues:CatalogueModel[];
  search: UntypedFormControl = new UntypedFormControl('');
  events: EventModel[] ;
  filteredOptions: CatalogueModel[];
  checked: boolean = true;
  form: UntypedFormGroup = this.newForm;
  id: string = '';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  panelHeader: string = 'Crear fase';
  planning:ReadPlanningDto = {}
  plannings: PlanningModel[] = [];

  constructor(
    public messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    private coreService: CoreService,
    private eventsHttpService: EventsHttpService,
    private formBuilder: UntypedFormBuilder,
    private planningsHttpService: PlanningsHttpService,
    private router: Router,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Convocatorias', routerLink: ['/uic/plannings']},
      {label: `${this.planningsHttpService.plannings.name}`, routerLink: ['/uic/events/plannings',this.planningsHttpService.plannings.id]},
      {label: 'Nueva fase'},
    ]);
      console.log(activatedRoute.snapshot.params['id'] )
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar fase';
    }
    this.planning = planningsHttpService.plannings
    console.log(planningsHttpService.plannings)
    console.log(this.planningsHttpService.plannings.endDate)
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getEvents();
    this.getEventSorts();
    this.getCatalogueName();
    this.getPlanningName();
    this.cataloguesHttpService.findEverything().subscribe((data) => {
      this.catalogues = data;
      this.filterOptions();
      console.log(this.catalogues)
    });
    if(this.id){
    this.getEvent();
  }
  }

  get newForm(): UntypedFormGroup {
    const maxEndDate = this.planningsHttpService.plannings.endDate;
    return this.formBuilder.group({
      catalogue: [null, [Validators.required]],
      endDate: [
        null, 
        [Validators.required,
          (control: AbstractControl) => {
            const endDateValue = control.value;
            const maxEndDate = this.planningsHttpService.plannings.endDate;
            const maxEndDateFormatted = new Date(maxEndDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' });
            const endDateValueNum = endDateValue ? new Date(endDateValue).getTime() : null;
            const maxEndDateNum = new Date(maxEndDate).getTime();
            if (endDateValueNum && endDateValueNum > maxEndDateNum) {
              return { endDateMaxError: `La fecha no puede ser posterior a la fecha máxima de la convocatoria (${maxEndDateFormatted})` };
            }
            return null;
          },
          DateValidators.min(new Date())
        ]
      ],
      isEnable: [false, [Validators.required]],
      planning: [null, [Validators.required]],
      startDate: [null, [DateValidators.min(new Date())]],
      sort: [null, [Validators.required]],
    });
  }
  
  filterOptions(): void {
    this.filteredOptions = this.catalogues.filter((option) => {
      return option.catalogueType.name === "FASES";
    });
  }
  getEvents(page: number = 0,planningId:string=`${this.planningsHttpService.plannings.id}`):void{
    this.eventsHttpService.findByPlanning(page,this.search.value,planningId).subscribe(events =>{
      this.events =events;
      console.log(events);
    })
  }
  getEventSorts(page: number = 0, planningId: string = this.planningsHttpService.plannings.id): void {
    this.eventsHttpService.findByPlanning(page, this.search.value, planningId).subscribe(events => {
      this.eventSorts = events.map(event => event.sort); // Asigna los valores de sort a la propiedad de la clase
      console.log(this.eventSorts);
      const sortField = this.newForm.controls['sort'];
      console.log(sortField.value);
      if (this.eventSorts.includes(sortField.value)) {
        sortField.setErrors({ exists: 'Ya existe una fase con este orden' });
      } else {
        sortField.setErrors(null);
      }
    });
  }
  onSubmit(): void {
    if (this.form.valid) {
      this.getEventSorts(); 
      if (this.id != '') {
        this.update(this.form.value);
      } else {
        this.create(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields.then();
    }
  }

  back(planningId: string): void {
    this.router.navigate(['/uic/events/plannings',planningId]);
  }
  
  create(event: CreateEventDto): void {
    this.eventsHttpService.create(event).subscribe(event => {
      this.form.reset(event);
      this.back(this.planning.id);
    });
  }


  getEvent(): void {
    this.isLoadingSkeleton = true;
    this.eventsHttpService.findOne(this.id).subscribe((event) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(event);
      let startedAt = format(new Date(event.startDate), 'dd/MM/yyyy');
      console.log (startedAt);
      this.startDateField.setValue(startedAt);
      let endedAt = format(new Date(event.endDate), 'dd/MM/yyyy');
      console.log (endedAt);
      this.endDateField.setValue(endedAt);
    });
  }

  getCatalogueName(): void {
    this.isLoadingSkeleton = true;
    this.cataloguesHttpService.catalogue(CatalogueTypeEnum.EVENT_NAMES).subscribe((catalogue) => {
      this.isLoadingSkeleton = false;
      this.catalogue = catalogue;
    });
  }

  getPlanningName(): void {
    this.isLoadingSkeleton = true;
    this.planningsHttpService.planning(PlanningTypeEnum.EVENT_NAMES).subscribe((plannings) => {
      this.isLoadingSkeleton = false;
      this.plannings = plannings;
    });
  }

  update(event:UpdateEventDto): void {
    this.eventsHttpService.update(this.id, event).subscribe((event) => {
      this.form.reset(event);
      this.back(this.planning.id)
    });
  }

  // Getters

  get catalogueField() {
    return this.form.controls['catalogue'];
  }

  get planningField() {
    return this.form.controls['planning'];
  }

  get startDateField() {
    return this.form.controls['startDate'];
  }

  get endDateField() {
    return this.form.controls['endDate'];
  }

  get isEnableField() {
    return this.form.controls['isEnable'];
  }

  get sortField() {
    return this.form.controls['sort'];
  }

}
