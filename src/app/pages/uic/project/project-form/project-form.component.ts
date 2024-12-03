import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { CreateProjectDto, EnrollmentModel, ProjectPlanModel, UpdateProjectDto } from '@models/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import { EnrollmentsHttpService, ProjectsHttpService, ProjectPlansHttpService } from '@services/uic';
import { CatalogueTypeEnum } from '@shared/enums';
import {OnExitInterface} from '@shared/interfaces';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  enrollments: EnrollmentModel[] = [];
  projectPlans: ProjectPlanModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear Projecto';
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;


  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private projectsHttpService: ProjectsHttpService,
    private enrollmentsHttpService: EnrollmentsHttpService,
    private projectPlansHttpService: ProjectPlansHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Projects', routerLink: ['/uic/projects']},
      {label: 'Form'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Update Project';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.loadProjectPlans();
    this.loadEnrollments();
    this.getProject();
    this.getEnrollment();
    console.log(this.id);
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      enrollment:[null,[Validators.required]],
      projectPlan:[null,[Validators.required]],
      title: [null, [Validators.required]],
      approved: [false, [Validators.required]],
      description: [null, [Validators.required]],
      score: [null, [Validators.required]],
      observation:[null, [Validators.required]],
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
    this.router.navigate(['/uic/projects']);
  }

  create(project: CreateProjectDto): void {
    this.projectsHttpService.create(project).subscribe(project => {
      console.log(project);
      this.form.reset(project);
      this.back();
    });
  }

  // getProjectPlan(): void {
  //   this.isLoadingSkeleton = true;
  //   this.projectPlansHttpService.projectPlan(ProjectPlanEnum.PROJECT).subscribe((projectPlans) => {
  //     this.isLoadingSkeleton = false;
  //     this.projectPlans = projectPlans;
  //   });
  // }

  getProject(): void {
    this.isLoadingSkeleton = true;
    this.projectsHttpService.findOne(this.id).subscribe((project) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(project);
    });
  }
  getProjectPlan(): void {
    this.isLoadingSkeleton = true;
    this.projectPlansHttpService.catalogue(CatalogueTypeEnum.PROJECT_PLAN_TITLES).subscribe((projectPlan) => {
      this.isLoadingSkeleton = false;
      this.projectPlans = projectPlan

    });
  }

  getEnrollment(): void {
    this.isLoadingSkeleton = true;
    this.enrollmentsHttpService.catalogue(CatalogueTypeEnum.PROJECT_PLAN_CODES).subscribe((enrollment) => {
      this.isLoadingSkeleton = false;
      this.enrollments = enrollment

    });
  }

  update(project: UpdateProjectDto): void {
    this.projectsHttpService.update(this.id, project).subscribe((project) => {
      this.form.reset(project);
      this.back()
    });
  }

  loadEnrollments(): void {
    this.enrollmentsHttpService.findAll().subscribe((enrollments) => this.enrollments = enrollments);
  }

  loadProjectPlans(): void {
    this.projectPlansHttpService.findAll().subscribe((projectPlans) => this.projectPlans = projectPlans);
  }

  // Getters

   get idField() {
     return this.form.controls['id'];
  }

  get enrollmentField() {
    return this.form.controls['enrollment'];
  }

  get projectPlanField(): AbstractControl{
    return this.form.controls['projectPlan'];
  }

  get titleField() {
    return this.form.controls['title'];
  }

  get approvedField() {
    return this.form.controls['approved'];
  }

  get descriptionField() {
    return this.form.controls['description'];
  }

  get scoreField() {
    return this.form.controls['score'];
  }

  get observationField() {
    return this.form.controls['observation'];
  }


}
