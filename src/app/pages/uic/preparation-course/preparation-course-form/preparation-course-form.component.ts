import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CareerModel, YearModel } from '@models/core';
import { CatalogueModel, CreatePreparationCourseDto, PlanningModel, UpdatePreparationCourseDto } from '@models/uic';
import { BreadcrumbService,CoreService, MessageService, YearsHttpService } from '@services/core';
import { CareersHttpService } from '@services/core/careers-http.service';
import { PlanningsHttpService, PreparationCoursesHttpService, } from '@services/uic';
import { CatalogueTypeEnum } from '@shared/enums';
import { DateValidators } from '@shared/validators';

@Component({
  selector: 'app-preparation-course-form',
  templateUrl: './preparation-course-form.component.html',
  encapsulation: ViewEncapsulation.None
})

export class PreparationCourseFormComponent implements OnInit {

  id: string = '';
  years: YearModel[] = [];
  careers: CareerModel[] = [];
  planningName: PlanningModel[] = [];
  bloodTypes: CatalogueModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear Curso de Actualización';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private preparationCoursesHttpService: PreparationCoursesHttpService,
    private yearsHttpService: YearsHttpService,
    private careersHttpService: CareersHttpService,
    private planningNameHttpService: PlanningsHttpService,
    ) {

    this.breadcrumbService.setItems([
      {label: 'Cursos de actualizacion', routerLink: ['/uic/preparation-courses']},
      {label: 'Formulario'},
    ]);
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Editar Curso de Actualización';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.loadPlanningName();
    this.getCareer();
    if (this.id!='') this.getPreparationCourse();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      name:[null, [Validators.required]],
      startDate: [new Date(),[Validators.required]],
      endDate: [new Date(),[Validators.required, DateValidators.min(new Date())]],
      description:[null,[Validators.required]],
      planningName:[null,[Validators.required]],
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
    this.router.navigate(['/uic/preparation-courses']);
  }

  create(preparationCourse: CreatePreparationCourseDto): void {
    this.preparationCoursesHttpService.create(preparationCourse).subscribe(preparationCourse => {
      this.form.reset(preparationCourse);
      this.back();
    });
  }

  getPreparationCourse(): void {
    this.isLoadingSkeleton = true;
    this.preparationCoursesHttpService.findOne(this.id).subscribe((preparationCourse) => {
      this.isLoadingSkeleton = false;
      preparationCourse.startDate = new Date(preparationCourse.startDate)
      preparationCourse.endDate = new Date(preparationCourse.endDate)
      this.form.patchValue(preparationCourse);
    });
  }

  //FK
  loadYears(): void {
    this.yearsHttpService.findAll().subscribe((year) => this.years = year);
  }

  loadPlanningName(): void {
    this.planningNameHttpService.findAll().subscribe((planningName) => this.planningName = planningName);
  }

  getCareer(): void {
    this.isLoadingSkeleton = true;
    this.careersHttpService.career(CatalogueTypeEnum.CAREER).subscribe((careers) => {
      this.isLoadingSkeleton = false;
      this.careers = careers;
    });
  }

//ACTUALIZAR
  update(preparationCourse: UpdatePreparationCourseDto): void {
    this.preparationCoursesHttpService.update(this.id, preparationCourse).subscribe((preparationCourse) => {
      this.form.reset(preparationCourse);
      this.back()
    });
  }

//GET

  get idField() {
    return this.form.controls['id'];
  }

  get nameField() {
    return this.form.controls['name'];
  }

  get startDateField() {
    return this.form.controls['startDate'];
  }

  get endDateField() {
    return this.form.controls['endDate'];
  }

  get descriptionField(): AbstractControl {
    return this.form.controls['description'];
  }

  get planningNameField(): AbstractControl {
    return this.form.controls['planningName'];
  }
}
