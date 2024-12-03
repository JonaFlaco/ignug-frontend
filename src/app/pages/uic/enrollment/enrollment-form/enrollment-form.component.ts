import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbService,CoreService, MessageService, StudentsHttpService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import {CatalogueModel, CreateEnrollmentDto, ModalityModel, PlanningModel, UpdateEnrollmentDto } from '@models/uic';
import {EnrollmentsHttpService,ModalitiesHttpService, PlanningsHttpService } from '@services/uic';
import { ModalityTypeEnum } from '@shared/enums/modality';
import { PlanningTypeEnum } from '@shared/enums/planning.enum';
import { StudentModel } from '@models/core';
import { CatalogueTypeEnum } from '@shared/enums';
import { StudentTypeEnum } from '@shared/enums/student.enum';
import { AuthService } from '@services/auth';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-enrollment-form',
  templateUrl: './enrollment-form.component.html',
  styleUrls: ['./enrollment-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EnrollmentFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  modalities: ModalityModel[] = [];
  search: UntypedFormControl = new UntypedFormControl('');
  // requirements: MeshStudentRequirementModel[] = [];
  students: StudentModel[] = [];
  planning:string;
  // states: CatalogueModel[] = [];
  bloodTypes: CatalogueModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear Inscripción';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  states: any;
  selectedStates: any;

  constructor(
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private enrollmentsHttpService: EnrollmentsHttpService,
    private modalitiesHttpService: ModalitiesHttpService,
    private planningsHttpService: PlanningsHttpService,
    private studentsHttpService: StudentsHttpService,
    // private statesHttpService: CataloguesHttpService,
    // private meshStudentRequirementsHttpService: MeshStudentRequirementsHttpService
    ) {

    this.breadcrumbService.setItems([
      {label: 'Inscripciones', routerLink: ['/uic/enrollments']},
      {label: 'Formulario'},
    ]);
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Update Enrollment';
    }
    this.states = [
      { name: 'Matriculado', code: 'MTCL' },
      { name: 'En Proceso', code: 'FENPR' },
      { name: 'Desertor', code: 'DSRT' }
    ];
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getModalities();
    this.getStudents();
    this.loadModalities();
    //this.loadPlannings();
    this.getEnrollment();
    this.findActive();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      code:[null],
      student:[null, [Validators.required]],
      state:[null],
      stateM:[false],
      observation:[null],
      registeredAt:[new Date()],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.id != '') {
        this.update(this.form.value);
      } else {
        console.log(this.studentField.value)
        this.create(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields.then();
    }
  }

  back(): void {
    this.router.navigate(['/uic/enrollments']);
  }

  create(enrollment: CreateEnrollmentDto): void {
    this.enrollmentsHttpService.create(enrollment).subscribe(enrollment => {
      this.form.reset(enrollment);
      this.back();
    });
  }

  loadModalities(): void {
    this.modalitiesHttpService.findAll().subscribe((modalities) => this.modalities = modalities);
  }
  // loadPlannings(): void {
  //   this.planningsHttpService.findAll().subscribe((plannings) => this.plannings = plannings);
  // }
  // loadState(): void {
  //   this.statesHttpService.findAll().subscribe((states) => this.states = states);
  // }

  getEnrollment(): void {
    this.isLoadingSkeleton = true;
    this.enrollmentsHttpService.findOne(this.id).subscribe((enrollment) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(enrollment);
    });
  }

  //FK
  getModalities(): void {
    this.isLoadingSkeleton = true;
    this.modalitiesHttpService.modality(ModalityTypeEnum.MODALITY).subscribe((modalities) => {
      this.isLoadingSkeleton = false;
      this.modalities = modalities
    });
  }

  getStudents(page: number = 0): void {
    this.isLoadingSkeleton = true;
    this.studentsHttpService.findAll(page, this.search.value).subscribe((students) => {
      this.isLoadingSkeleton = false;
      this.students = students.filter(
        (students) => students.career.id == this.authService.auth.teacher.career.id
      )
      console.log(this.students)
    });
  }

  // getStudents(): void {
  //   this.isLoadingSkeleton = true;
  //   this.studentsHttpService.student(StudentTypeEnum.STUDENT).subscribe((students) => {
  //     this.isLoadingSkeleton = false;
  //     this.students = students.filter(
  //       (students) => students.career.id == this.authService.auth.teacher.career.id
  //     )
  //     console.log(this.students)
  //   });
  // }

  // getStudents(): void {
  //   this.isLoadingSkeleton = true;
  //   this.studentsHttpService.filterStudent(StudentTypeEnum.STUDENT).subscribe((students) => {
  //     this.isLoadingSkeleton = false;
  //     this.students = students.filter(
  //       (students) => students.career.id == this.authService.auth.teacher.career.id
  //     )
  //   });
  // }

  // findAll(page: number = 0) {
  //   this.theoricalNotesHttpService
  //     .findAllbyUser(page, this.search.value)
  //     .subscribe(
  //       (theoricals) =>
  //         (this.theoricals = theoricals.filter(
  //           (theoricals) => theoricals.name.student.user.id == this.authService.auth.id
  //         ))
  //     );
  // }

  // getPlanning(): void {
  //   this.isLoadingSkeleton = true;
  //   this.planningsHttpService.planning(PlanningTypeEnum.PLANNING).subscribe((plannings) => {
  //     this.isLoadingSkeleton = false;
  //     this.plannings = plannings
  //   });
  // }

//ACTUALIZAR
  update(enrollment: UpdateEnrollmentDto): void {
    this.enrollmentsHttpService.update(this.id, enrollment).subscribe((enrollment) => {
      this.form.reset(enrollment);
      this.back()
    });
  }

  findActive () {
    this.planningsHttpService.findActive().subscribe(planning=>{
      this.planning = planning.name;
    })
  }

//GET

  get idField() {
    return this.form.controls['id'];
  }

  get studentField() {
    return this.form.controls['student'];
  }

  get stateField() {
    return this.form.controls['state'];
  }

  get stateMField() {
    return this.form.controls['stateM'];
  }

  get codeField() {
    return this.form.controls['code'];
  }

  get registeredAtField() {
    return this.form.controls['registeredAt'];
  }

  get observationField() {
    return this.form.controls['observation'];
  }

}
