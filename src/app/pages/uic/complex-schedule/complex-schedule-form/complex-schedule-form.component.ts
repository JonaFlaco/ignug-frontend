import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateComplexScheduleDto, UpdateComplexScheduleDto, UploadProjectModel } from '@models/uic';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { ComplexSchedulesHttpService, UploadProjectsHttpService } from '@services/uic';
import { CatalogueTypeEnum } from '@shared/enums';
import { OnExitInterface } from '@shared/interfaces';
import { DateValidators } from '@shared/validators';
import { addMonths, format } from 'date-fns';

@Component({
  selector: 'app-complex-schedule-form',
  templateUrl: './complex-schedule-form.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ComplexScheduleFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  eventSorts: number[] = [];
  form: UntypedFormGroup = this.newForm;
  uploadProjects: UploadProjectModel[] = [];
  panelHeader: string = 'Asignar Actividades al cronograma';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private ComplexSchedulesHttpService: ComplexSchedulesHttpService,
    private uploadProjectsHttpService: UploadProjectsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {
        label: 'Informacion general del proyecto',
        routerLink: ['/uic/complex-schedules'],
      },
      { label: 'Actividades' },
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar Informacion';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService
        .questionOnExit()
        .then((result) => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
  }

  get newForm(): UntypedFormGroup {
    const fechaActual = new Date();
    const fechaActual2 = new Date(addMonths(fechaActual, 2));
    return this.formBuilder.group({
      activity: ['ej: Inicio del curso', [Validators.required]],
      startDate: [fechaActual, [
        DateValidators.min(fechaActual),
      ]],
      description: ['ej: Inicio del curso', [Validators.required]],
      endDate: [fechaActual2, [
        DateValidators.min(fechaActual),
        DateValidators.max(addMonths(fechaActual, 4)),
      ]],
      state: [false],
      sort: [null, [Validators.required]],
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
    this.router.navigate(['/uic/complex-schedules']);
  }

  create(ComplexSchedule: CreateComplexScheduleDto): void {
    this.ComplexSchedulesHttpService.create(ComplexSchedule).subscribe((ComplexSchedule) => {
      this.form.reset(ComplexSchedule);
      this.back();
    });
  }

  getProjectName(): void {
    this.isLoadingSkeleton = true;
    this.uploadProjectsHttpService.uploadProject(CatalogueTypeEnum.UPLOAD_PROJECT).subscribe((uploadProjects) => {
      this.isLoadingSkeleton = false;
      this.uploadProjects = uploadProjects;
    });
  }

  getEventSorts(): void {
    this.ComplexSchedulesHttpService.findAll().subscribe(events => {
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

  update(ComplexSchedule: UpdateComplexScheduleDto): void {
    this.ComplexSchedulesHttpService
      .update(this.id, ComplexSchedule)
      .subscribe((ComplexSchedule) => {
        this.form.reset(ComplexSchedule);
        this.back();
      });
  }

  // Getters

  get activityField() {
    return this.form.controls['activity'];
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

  get sortField() {
    return this.form.controls['sort'];
  }
}
