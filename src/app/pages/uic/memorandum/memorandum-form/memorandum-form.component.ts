import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { StudentModel, TeacherModel } from '@models/core';
import { CreateMemorandumDto, MemorandumModel, UpdateMemorandumDto } from '@models/uic/memorandum.model';
import {BreadcrumbService, CoreService, MessageService, StudentsHttpService, TeachersHttpService, } from '@services/core';
import { MemorandumsHttpService } from '@services/uic';
import { StudentTypeEnum } from '@shared/enums/student.enum';
import {OnExitInterface} from '@shared/interfaces';
@Component({
  selector: 'app-memorandum-form',
  templateUrl:'./memorandum-form.component.html',
  encapsulation: ViewEncapsulation.None
})

export class MemorandumFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: MemorandumModel[] = [];
  nameStudents: StudentModel[] = [];
  nameTeachers: TeacherModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear Memorando';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;
  types: any[];
  selectedTypes: any;


  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private memorandumsHttpService: MemorandumsHttpService,
    private studentsHttpService: StudentsHttpService,
    private teachersHttpService: TeachersHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Memorandos', routerLink: ['/uic/memorandum-home']},
      {label: 'Formulario'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Update Memorandum';
    }
    this.types = [
      { name: 'Aplicador del examen teórico', code: 'AEXT' },
    ];

  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getMemorandum();
    this.getStudents();
    this.getTeachers();
  }

  get newForm(): UntypedFormGroup {
    const currentDate = new Date();
    return this.formBuilder.group({
      type: [null, [Validators.required]],
      nameTeacher: [null, [Validators.required]],
      nameStudent: [null, [Validators.required]],
      lab: [null, [Validators.required]],
      dateWritten: [currentDate, Validators.required],
      dateApplication: [null, [Validators.required, this.dateApplicationValidator.bind(this)]],
      time: [null, [Validators.required]],
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
    this.router.navigate(['/uic/memorandum-home']);
  }

  create(memorandum: CreateMemorandumDto): void {
    this.memorandumsHttpService.create(memorandum).subscribe(memorandum => {
      this.form.reset(memorandum);
      this.back();
    });
  }

  getStudents(): void {
    this.isLoadingSkeleton = true;
    this.studentsHttpService.student(StudentTypeEnum.STUDENT).subscribe((nameStudents) => {
      this.isLoadingSkeleton = false;
      this.nameStudents = nameStudents
    });
  }

   getTeachers(): void {
    this.teachersHttpService.findAll().subscribe((nameTeachers) => this.nameTeachers = nameTeachers);
  }

  getMemorandum(): void {
    this.isLoadingSkeleton = true;
    this.memorandumsHttpService.findOne(this.id).subscribe((memorandum) => {
      this.isLoadingSkeleton = false;

      const dateWritten = new Date();
      if (dateWritten) {
        dateWritten.setDate(dateWritten.getDate() + 1);
        dateWritten.setDate(dateWritten.getDate() - 1);
      }
      const dateApplication = memorandum.dateApplication ? new Date(memorandum.dateApplication) : null;
      if (dateApplication) {
        dateApplication.setDate(dateApplication.getDate() + 1);
      }

      this.form.patchValue({
        ...memorandum,
        dateWritten,
        dateApplication
      });
    });
  }

  dateApplicationValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const selectedDate = control.value;
    const currentDate = new Date();

    if (selectedDate && selectedDate <= currentDate) {
      return { 'invalidDate': true };
    }

    return null;
  }


  update(memorandum: UpdateMemorandumDto): void {
    this.memorandumsHttpService.update(this.id, memorandum).subscribe((memorandum) => {
      this.form.reset(memorandum);
      this.back()
    });
  }

  // Getters
  get idField() {
    return this.form.controls['id'];
  }

  get typeField() {
    return this.form.controls['type'];
  }

  get nameTeacherField() {
    return this.form.controls['nameTeacher'];
  }

  get nameStudentField() {
    return this.form.controls['nameStudent'];
  }

  get labField() {
    return this.form.controls['lab'];
  }

  get dateWrittenField() {
    return this.form.controls['dateWritten'];
  }

  get dateApplicationField() {
    return this.form.controls['dateApplication'];
  }

  get timeField() {
    return this.form.controls['time'];
  }

}
