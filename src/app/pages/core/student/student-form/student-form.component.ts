import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { UserModel } from '@models/auth';
import { CareerModel } from '@models/core';
import { CreateStudentDto, StudentModel, UpdateStudentDto } from '@models/core/student.model';
import { UsersHttpService } from '@services/auth/users-http.service';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import { StudentsHttpService } from '@services/core';
import { CareersHttpService } from '@services/core/careers-http.service';
import { CatalogueTypeEnum } from '@shared/enums';
import {OnExitInterface} from '@shared/interfaces';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class StudentFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: StudentModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Registrar estudiantes';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;
  careers: CareerModel[] = [];
  users: UserModel[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private studentsHttpService: StudentsHttpService,
    private careersHttpService: CareersHttpService,
    private usersHttpService: UsersHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router
  ) {
    this.breadcrumbService.setItems([
      { label: 'Students', routerLink: ['/core/students'] },
      { label: 'Form' },
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Update Student';
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
    this.getUser();
    //this.getStudent();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      identification_card: [null, [Validators.nullValidator]],
      name: [null, [Validators.nullValidator]],
      career: [null, [Validators.required]],
      user: [null, [Validators.required]],
      // ethnicity:[null, [Validators.required]],
      // gender:[null, [Validators.required]],
      // email:[null, [Validators.email]],
      // cellphone:[null, [Validators.required]],
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
    this.router.navigate(['/core/students']);
  }

  create(student: CreateStudentDto): void {
    this.studentsHttpService.create(student).subscribe((student) => {
      this.form.reset(student);
      this.back();
    });
  }

  getStudent(): void {
    this.isLoadingSkeleton = true;
    this.studentsHttpService.findOne(this.id).subscribe((student) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(student);
    });
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

  getUser(): void {
    this.isLoadingSkeleton = true;
    this.usersHttpService
      .catalogue(CatalogueTypeEnum.USER)
      .subscribe((users) => {
        this.isLoadingSkeleton = false;
        this.users = users
      });
  }

  // loadUsers(): void {
  //   this.usersHttpService.findAll(0, '', 100).subscribe((user) => (this.users = user));
  // }

  update(student: UpdateStudentDto): void {
    this.studentsHttpService.update(this.id, student).subscribe((student) => {
      this.form.reset(student);
      this.back();
    });
  }

  onSelectedUser() {
    this.nameField.setValue( this.userField.value.name);
    this.identificationCardField.setValue( this.userField.value.identification as number) ;
  }

  // Getters

  get idField() {
    return this.form.controls['id'];
  }

  get identificationCardField() {
    return this.form.controls['identification_card'];
  }

  get nameField() {
    return this.form.controls['name'];
  }

  get careerField() {
    return this.form.controls['career'];
  }

  get userField() {
    return this.form.controls['user'];
  }

  // get ethnicityField() {
  //   return this.form.controls['ethnicity'];
  // }

  // get genderField() {
  //   return this.form.controls['gender'];
  // }

  // get emailField() {
  //   return this.form.controls['email'];
  // }

  // get cellphoneField() {
  //   return this.form.controls['cellphone'];
  // }
}
