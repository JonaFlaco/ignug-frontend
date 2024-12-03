import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbService, CoreService, MessageService, StudentsHttpService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import { StudentInformationModel, CreateStudentInformationDto, UpdateStudentInformationDto } from '@models/uic';
import { StudentInformationsHttpService } from '@services/uic';
import { StudentTypeEnum } from '@shared/enums/student.enum';
import { format } from 'date-fns';

@Component({
  selector: 'app-student-information-form',
  templateUrl: './student-information-complexivo-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class StudentInformationComplexivoFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  // bloodTypes: StudentInformationModel[] = [];
  // students: StudentModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Añadir Informacion laboral del estudiante';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private studentInformationsHttpService: StudentInformationsHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private studentHttpService: StudentsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Información Laboral', routerLink: ['/uic/student-informations']},
      {label: 'Información Laboral', routerLink: ['/uic/student-informations/complexivo'] }
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar Información del estudiante';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    //this.getStudentObservations();
    this.getstudentInformation();

  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      // student: [null],
      cedula: [null, [Validators.required]],
      name: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      genre:[null, [Validators.required]],
      personalEmail:[null, [Validators.required]],
      email:[null, [Validators.required]],
      birthDate:[null, [Validators.required]],
      provinceBirth:[null, [Validators.required]],
      cantonBirth:[null, [Validators.required]],
      currentLocation:[null, [Validators.required]],
      entryCohort:[null, [Validators.required]],
      exitCohort:[null,],
      companyWork:[null, [Validators.required]],
      companyArea:[null, [Validators.required]],
      companyPosition:[null, [Validators.required]],
      laborRelation:[null, [Validators.required]],
      status:[false, [Validators.required]],
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
    this.router.navigate(['/uic/student-informations']);
  }

  create(studentInformation: CreateStudentInformationDto): void {
    this.studentInformationsHttpService.create(studentInformation).subscribe(studentInformation => {
      this.form.reset(studentInformation);
      this.back();
    });
  }

  getstudentInformation(): void {
    this.isLoadingSkeleton = true;
    this.studentInformationsHttpService.findOne(this.id).subscribe((studentInformation) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(studentInformation);
      // let birthDate = format(new Date(studentInformation.birthDate), 'dd/MM/yyyy');
      // this.birthDateField.setValue(birthDate);
      let exitCohort = format(new Date(studentInformation.exitCohort), 'dd/MM/yyyy');
      this.exitCohortField.setValue(exitCohort);
    });
  }

  // getStudentObservations(): void {
  //   this.isLoadingSkeleton = true;
  //   this.studentHttpService.student(StudentTypeEnum.STUDENT_INFORMATION_OBSERVATIONS).subscribe((students) => {
  //     this.isLoadingSkeleton = false;
  //     this.students = students;
  //   });
  // }

  update(studentInformation: UpdateStudentInformationDto): void {
    this.studentInformationsHttpService.update(this.id, studentInformation).subscribe((studentInformation) => {
      this.form.reset(studentInformation);
      this.back()
    });
  }

  // Getters

  // get studentField() {
  //   return this.form.controls['student'];
  // }

  get cedulaField() {
    return this.form.controls['cedula'];
  }

  get nameField() {
    return this.form.controls['name'];
  }

  get phoneField() {
    return this.form.controls['phone'];
  }

  get genreField() {
    return this.form.controls['genre'];
  }

  get personalEmailField() {
    return this.form.controls['personalEmail'];
  }

  get emailField() {
    return this.form.controls['email'];
  }

  get birthDateField() {
    return this.form.controls['birthDate'];
  }

  get provinceBirthField() {
    return this.form.controls['provinceBirth'];
  }

  get cantonBirthField() {
    return this.form.controls['cantonBirth'];
  }

  get currentLocationField() {
    return this.form.controls['currentLocation'];
  }

  get entryCohortField() {
    return this.form.controls['entryCohort'];
  }

  get exitCohortField() {
    return this.form.controls['exitCohort'];
  }
  get companyWorkField() {
    return this.form.controls['companyWork'];
  }

  get companyAreaField() {
    return this.form.controls['companyArea'];
  }

  get companyPositionField() {
    return this.form.controls['companyPosition'];
  }

  get laborRelationField() {
    return this.form.controls['laborRelation'];
  }

  get statusField() {
    return this.form.controls['status'];
  }

}
