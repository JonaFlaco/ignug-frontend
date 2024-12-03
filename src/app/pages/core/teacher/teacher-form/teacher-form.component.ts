import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { CareerModel } from '@models/core';
import { CreateTeacherDto, TeacherModel, UpdateTeacherDto } from '@models/core/teacher.model';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import { CareersHttpService } from '@services/core/careers-http.service';
import { TeachersHttpService } from '@services/core/teacher-http.service';
import { CatalogueTypeEnum } from '@shared/enums';
import {OnExitInterface} from '@shared/interfaces';
import { AuthService, UsersHttpService } from '@services/auth';
import { RoleModel } from '@models/auth';
import { UserModel } from '@models/auth';

@Component({
  selector: 'app-teacher-form',
  templateUrl:'./teacher-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TeacherFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: TeacherModel[] = [];
  careers:CareerModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Registrar docentes';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;
  role:RoleModel={};
  users: UserModel[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private teachersHttpService: TeachersHttpService,
    private careersHttpService: CareersHttpService,
    private usersHttpService: UsersHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private authService:AuthService,

  ) {
    this.breadcrumbService.setItems([
      {label: 'Teachers', routerLink: ['/core/teachers']},
      {label: 'Form'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar Profesor';
    }
    console.log(authService.roles);
    // this.role=authService.roles.find(role => role.code =='admin');
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getTeacher();
    this.getCarrer();
    this.getUser();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
     career :[null,[Validators.required]],
     name: [null, [Validators.required]],
     user: [null, [Validators.required]],

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
    this.router.navigate(['/core/teachers']);
  }

  create(teacher: CreateTeacherDto): void {
    this.teachersHttpService.create(teacher).subscribe(teacher => {
      this.form.reset(teacher);
      this.back();
    });
  }


  getTeacher(): void {
    this.isLoadingSkeleton = true;
    this.teachersHttpService.findOne(this.id).subscribe((teacher) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(teacher);
    });
  }

  getCarrer(): void {
    this.isLoadingSkeleton = true;
    this.careersHttpService.career(CatalogueTypeEnum.CAREER).subscribe((careers) => {
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

  update(teacher: UpdateTeacherDto): void {
    this.teachersHttpService.update(this.id, teacher).subscribe((teacher) => {
      this.form.reset(teacher);
      this.back()
    });
  }

  onSelectedUser() {
    this.nameField.setValue( this.userField.value.name);

  }

  // Getters
  get idField() {
    return this.form.controls['id'];
  }

  get careerField() {
    return this.form.controls['career'];
  }

  get nameField() {
    return this.form.controls['name'];
  }

  get userField() {
    return this.form.controls['user'];
  }


}
