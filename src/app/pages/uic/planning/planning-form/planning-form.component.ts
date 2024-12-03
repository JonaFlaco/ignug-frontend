import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService, CoreService, MessageService, YearsHttpService, } from '@services/core';
import { OnExitInterface } from '@shared/interfaces';
import {
  ModalitiesHttpService,
  PlanningsHttpService,
  ProfessionsHttpService
} from '@services/uic';
import {
  CreatePlanningDto,
  ModalityModel,
  PlanningModel,
  ProfessionModel,
  UpdatePlanningDto,
} from '@models/uic';
import { YearModel } from '@models/core';
import { CatalogueTypeEnum, ModalityTypeEnum } from '@shared/enums';
import { format } from 'date-fns';
import { DateValidators } from '@shared/validators';
import { CareerModel } from '@models/core';
import { CareersHttpService } from '../../../../services/core/careers-http.service';
import { isAfter, addMonths,  } from 'date-fns';
import { compareAsc } from 'date-fns'

@Component({
  selector: 'app-planning-form',
  templateUrl: './planning-form.component.html',
  styleUrls: ['./planning-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PlanningFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: PlanningModel[] = [];
  nameModalities: ModalityModel[] = [];
  careers: CareerModel[] = [];
  years: YearModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear Convocatoria';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  fechaActual: Date;
  fechaLimite: Date;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private modalitiesHttpService: ModalitiesHttpService,
    private careersHttpService: CareersHttpService,
    private planningsHttpService: PlanningsHttpService,
    private yearsHttpService: YearsHttpService
  ) {
    this.breadcrumbService.setItems([
      { label: 'Convocatorias', routerLink: ['/uic/plannings'] },
      { label: 'Formulario' },
    ]);
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar Convocatoria';
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
    this.getCarrer();
    this.loadNameModality();
    this.loadYears();
    if (this.id != '') this.getPlanning();
  }

  get newForm(): UntypedFormGroup {
    const fechaActual = new Date();
    const fechaActual2 = new Date(addMonths(fechaActual, 4));
    return this.formBuilder.group({
      name: ['Ej: UIC 2022-1', [Validators.required]],
      year: [null, [Validators.required]],
      description: ['Ej: Convocatoria para egresados', [Validators.required]],
      endDate: [
        fechaActual2,
        [
          DateValidators.min(addMonths(fechaActual, 4)),
          DateValidators.max(addMonths(fechaActual, 6)),
        ],
      ],
      startDate: [fechaActual, [DateValidators.min(new Date())]],
      nameModality: [null, [Validators.required]],
      career: [null, [Validators.required]],
      state: [false, [Validators.required]],
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
    this.router.navigate(['/uic/plannings']);
  }

  create(planning: CreatePlanningDto): void {
    this.planningsHttpService.create(planning).subscribe((planning) => {
      this.form.reset(planning);
      this.back();
    });
  }

  getPlanning(): void {
    const fechaActual = new Date();
    const fechaActual2 = new Date(addMonths(fechaActual, 4));
    this.isLoadingSkeleton = true;
    this.planningsHttpService.findOne(this.id).subscribe((planning) => {
      this.isLoadingSkeleton = false;
      let startDate = format(new Date(planning.startDate), 'dd/MM/yyyy');
      let endDate = format(new Date(fechaActual), 'dd/MM/yyyy');
      planning.endDate = new Date(planning.endDate);
      this.form.patchValue(planning);
      this.startDateField.setValue(startDate);
      this.endDateField.setValue(endDate);
    });
  }

  loadNameModality(): void {
    this.modalitiesHttpService
      .modality(ModalityTypeEnum.PLANNING_NAMES)
      .subscribe(
        (nameModalities) =>
          (this.nameModalities = nameModalities.filter(
            (modalities) => modalities.state == true
          ))
      );
  }

  getCarrer(): void {
    this.isLoadingSkeleton = true;
    this.careersHttpService
      .career(CatalogueTypeEnum.CAREER)
      .subscribe((careers) => {
        this.isLoadingSkeleton = false;
        this.careers = careers;
      });
  }

  loadYears(): void {
    this.yearsHttpService.findAll().subscribe((year) => (this.years = year));
  }

  update(planning: UpdatePlanningDto): void {
    this.planningsHttpService
      .update(this.id, planning)
      .subscribe((planning) => {
        this.form.reset(planning);
        this.back();
      });
  }

  // Getters
  get idField() {
    return this.form.controls['id'];
  }

  get nameField() {
    return this.form.controls['name'];
  }

  get nameModalityField() {
    return this.form.controls['nameModality'];
  }

  get careerField() {
    return this.form.controls['career'];
  }

  get yearField() {
    return this.form.controls['year'];
  }
  get descriptionField() {
    return this.form.controls['description'];
  }

  get endDateField() {
    return this.form.controls['endDate'];
  }

  get startDateField() {
    return this.form.controls['startDate'];
  }
  get stateField() {
    return this.form.controls['state'];
  }
}
