import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import {RolesHttpService} from "@services/auth/roles-http.service";
import {CatalogueModel, CreateScheduleActivityDto, UpdateScheduleActivityDto } from '@models/uic';
import { CatalogueTypeEnum } from '@shared/enums';
import { ScheduleActivitiesHttpService } from '@services/uic/schedule-activity-http.service';
import { CataloguesHttpService } from '@services/uic';


@Component({
  selector: 'app-schedule-activity-form',
  templateUrl: './schedule-activity-form.component.html',
  styleUrls: ['./schedule-activity-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScheduleActivityFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  //careers: CareerModel[] = [];
  bloodTypes: CatalogueModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear Actividad';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private rolesHttpService: RolesHttpService,
    private scheduleActivitiesHttpService: ScheduleActivitiesHttpService,
    private catalogueHttpService: CataloguesHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Cronograma de Actividades', routerLink: ['/uic/schedule-activities']},
      {label: 'Formulario'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Guardar Cronograma de Actividades';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    //this.getModalityStates();
    this.getScheduleActivity();
    //this.loadStates();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      assignment: ['ej: Inicio de la actividad', [Validators.required]],
      startDate: [null, [Validators.required]],
      description: ['ej: datos de la actividad', [Validators.required]],
      endDate: [null, [Validators.required]],
      state: [null]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
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

  back(): void {
    this.router.navigate(['/uic/schedule-activities']);
  }

  create(scheduleActivities: CreateScheduleActivityDto): void {
    this.scheduleActivitiesHttpService.create(scheduleActivities).subscribe(scheduleActivities => {
      this.form.reset(scheduleActivities);
      this.back();
    });
  }

  //loadCareers(): void {
  //  this.careersHttpService.findAll().subscribe((roles) => this.roles = roles);
  //}


  //  loadStates(): void {
  //      this.cataloguesHttpService.catalogue(CatalogueTypeEnum.STATES).subscribe((states) => this.states = states);
  //   }

  // loadModalityStates(): void {
  //   this.cataloguesHttpService.catalogue(CatalogueTypeEnum.MODALITY_STATES).subscribe((states) => this.states = states);
  // }

  getScheduleActivity(): void {
    this.isLoadingSkeleton = true;
    this.scheduleActivitiesHttpService.findOne(this.id).subscribe((scheduleActivities) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(scheduleActivities);
    });
  }

  update(scheduleActivities: UpdateScheduleActivityDto): void {
    this.scheduleActivitiesHttpService.update(this.id, scheduleActivities).subscribe((scheduleActivities) => {
      this.form.reset(scheduleActivities);
      this.back()
    });
  }

  // Getters

  get assignmentField() {
    return this.form.controls['assignment'];
  }

  get startDateField() {
    return this.form.controls['startDate'];
  }

  get descriptionField() {
    return this.form.controls['description'];
  }

  get endDateField() {
    return this.form.controls['endDate'];
  }

  get stateField() {
    return this.form.controls['state'];
  }
}
