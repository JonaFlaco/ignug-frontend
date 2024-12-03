import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbService, CoreService, MessageService, TeachersHttpService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import {RolesHttpService} from "@services/auth/roles-http.service";
import {CatalogueModel, CreateProjectBenchDto, UpdateProjectBenchDto } from '@models/uic';
import { CatalogueTypeEnum } from '@shared/enums';
import { ProjectBenchsHttpService } from '@services/uic/project-bench-http.service';
import { CataloguesHttpService } from '@services/uic';
import { DateValidators } from '@shared/validators';
import { addMonths } from 'date-fns';
import { TeacherModel } from '@models/core';

@Component({
  selector: 'app-project-bench-form',
  templateUrl: './project-bench-form.component.html',
  styleUrls: ['./project-bench-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectBenchFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: CatalogueModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear Banco del Proyecto';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  teachers:TeacherModel[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private rolesHttpService: RolesHttpService,
    private projectBenchsHttpService: ProjectBenchsHttpService,
    private catalogueHttpService: CataloguesHttpService,
    private profesoresHttpService: TeachersHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Bancos del Proyecto', routerLink: ['/uic/project-bench']},
      {label: 'Formulario'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Guardar Banco del Proyecto';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getProjectBench();
    this.loadProfesores();
  }

  get newForm(): UntypedFormGroup {
    const fechaActual = new Date();
    const fechaActual2 = new Date(addMonths(fechaActual, 4));
    return this.formBuilder.group({
      teacher: [null, [Validators.required]],
      name: [null, [Validators.required ]],
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      startDate: [fechaActual, [DateValidators.min(new Date())]],
      endDate: [fechaActual2, [DateValidators.min(addMonths(fechaActual, 4)), DateValidators.max(addMonths(fechaActual, 6))]],
      state:[false, [Validators.required]],

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
    this.router.navigate(['/uic/project-benchs']);
  }

  create(projectBench: CreateProjectBenchDto): void {
    this.projectBenchsHttpService.create(projectBench).subscribe(projectBench => {
      this.form.reset(projectBench);
      this.back();
    });
  }

  getProjectBench(): void {
    this.isLoadingSkeleton = true;
    this.projectBenchsHttpService.findOne(this.id).subscribe((projectBench) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(projectBench);
    });
  }

  loadProfesores(): void {
    this.profesoresHttpService.findAll().subscribe((teacher) => this.teachers = teacher);
  }

  update(projectBench: UpdateProjectBenchDto): void {
    this.projectBenchsHttpService.update(this.id, projectBench).subscribe((projectBench) => {
      this.form.reset(projectBench);
      this.back()
    });
  }

  // Getters
  get idField() {
    return this.form.controls['id'];
  }

  get teacherField() {
    return this.form.controls['teacher'];
  }

  get nameField() {
    return this.form.controls['name'];
  }

  get stateField() {
    return this.form.controls['state'];
  }

  get titleField() {
    return this.form.controls['title'];
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

}
