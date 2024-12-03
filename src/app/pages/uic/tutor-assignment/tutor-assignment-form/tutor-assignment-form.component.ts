import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateTutorAssignmentDto, CatalogueModel, ProjectModel, UpdateTutorAssignmentDto, ProjectPlanModel, ModalityModel, PlanningModel, TeacherModel, EstudianteModel, UploadProjectModel, StudentInformationModel } from '@models/uic';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { CataloguesHttpService, TutorAssignmentsHttpService, ProjectsHttpService, PlanningsHttpService, TeachersHttpService, EstudiantesHttpService, UploadProjectsHttpService, StudentInformationsHttpService } from '@services/uic';
import { UntypedFormBuilder } from '@angular/forms';
import { CatalogueTypeEnum } from '@shared/enums';
import { OnExitInterface } from '@shared/interfaces';
import { ProjectPlansHttpService } from '../../../../services/uic/project-plan-http.service';
import { ModalitiesHttpService } from '../../../../services/uic/modality-http.service';

@Component({
  selector: 'app-tutor-assignment-form',
  templateUrl: './tutor-assignment-form.component.html',
})
export class TutorAssignmentFormComponent implements OnInit, OnExitInterface {

  id: string = '';
  uploadProjects: UploadProjectModel[] = [];
  names:ModalityModel[]=[];
  students:StudentInformationModel[]=[];
  estudiantes:EstudianteModel[]=[];
  teachers:TeacherModel []=[];
  types: CatalogueModel[] = [];
  projectPlans: ProjectPlanModel[] = [];
  panelHeader: string = 'Asignación de tutor';
  form: UntypedFormGroup = this.newForm;
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
    private tutorAssignmentsHttpService: TutorAssignmentsHttpService,
    private uploadProjectsHttpService: UploadProjectsHttpService,
    private projectPlansHttpService: ProjectPlansHttpService,
    private studentInformationsHttpService: StudentInformationsHttpService,
    private modalitiesHttpService: ModalitiesHttpService,
    private estudiantesHttpService: EstudiantesHttpService,
    private teachersHttpService: TeachersHttpService,


  ) {
    this.breadcrumbService.setItems([
      {label: 'Asignación tutor', routerLink: ['/uic/tutor-assignments']},
      {label: 'Formulario'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualiza Tutor Asignado';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getTutorAssignment();
    this.loadUploadProjects();
    this.loadNames();
    this.loadEstudiantes();
    this.loadTypes();
    this.loadProjectPlans();
    this.loadTeachers();
    this.loadStudentInformations();


  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      uploadProject: [null,[Validators.required]],
      teacher: [null,[Validators.required]],
      student:[null,[Validators.required]],

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
    this.router.navigate(['/uic/tutor-assignments']);
  }

  create(tutorAssignment: CreateTutorAssignmentDto): void {
    this.tutorAssignmentsHttpService.create(tutorAssignment).subscribe(tutorAssignment => {
      this.form.reset(tutorAssignment);
      this.back();
    });
  }

  loadTypes(): void {
    this.cataloguesHttpService.catalogue(CatalogueTypeEnum.TYPES).subscribe((types) => this.types = types);
  }

  loadUploadProjects(): void {
    this.uploadProjectsHttpService.findAll().subscribe((uploadProjects) => this.uploadProjects = uploadProjects);
  }
  loadProjectPlans(): void {
    this.projectPlansHttpService.findAll().subscribe((projectPlans) => this.projectPlans = projectPlans);
  }

  loadNames(): void {
    this.modalitiesHttpService.findAll().subscribe((name) => this.names = name);
  }

  loadEstudiantes(): void {
    this.estudiantesHttpService.findAll().subscribe((estudiante) => this.estudiantes = estudiante);
  }

  loadTeachers(): void {
    this.teachersHttpService.findAll().subscribe((teacher) => this.teachers = teacher);
  }

  loadStudentInformations(): void {
    this.studentInformationsHttpService.findAll().subscribe((students) => this.students = students);
  }



  getTutorAssignment(): void {
    this.isLoadingSkeleton = true;
    this.tutorAssignmentsHttpService.findOne(this.id).subscribe((tutorAssignment) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(tutorAssignment);
    });
  }
  getType(): void {
    this.isLoadingSkeleton = true;
    this.cataloguesHttpService.catalogue(CatalogueTypeEnum.TYPES).subscribe((type) => {
      this.isLoadingSkeleton = false;
      this.types = type

    });
  }
    getUploadProject(): void {
      this.isLoadingSkeleton = true;
      this.uploadProjectsHttpService.catalogue(CatalogueTypeEnum.UPLOAD_PROJECT).subscribe((uploadProject) => {
        this.isLoadingSkeleton = false;
        this.uploadProjects = uploadProject

      });
  }
  getProjectPlan(): void {
    this.isLoadingSkeleton = true;
    this.projectPlansHttpService.catalogue(CatalogueTypeEnum. PROJECT_PLAN_DESCRIPTION).subscribe((projectPlan) => {
      this.isLoadingSkeleton = false;
      this.projectPlans = projectPlan

    });
}

getStudentInformations(): void {
  this.isLoadingSkeleton = true;
  this.studentInformationsHttpService.catalogue(CatalogueTypeEnum.STUDENT_INFORMATION).subscribe((student) => {
    this.isLoadingSkeleton = false;
    this.students = student

  });
}
  update(tutorAssignment: UpdateTutorAssignmentDto): void {
    this.tutorAssignmentsHttpService.update(this.id, tutorAssignment).subscribe((tutorAssignment) => {
      this.form.reset(tutorAssignment);
      this.back()
    });
  }

  get idField(){
    return this.form.controls['id'];
  }

  get typeField(): AbstractControl {
    return this.form.controls['type'];
  }

  get uploadProjectField(): AbstractControl {
    return this.form.controls['uploadProject'];
  }


  get teacherField(): AbstractControl {
    return this.form.controls['teacher'];
  }

  get studentField(): AbstractControl {
    return this.form.controls['student'];
  }




}
