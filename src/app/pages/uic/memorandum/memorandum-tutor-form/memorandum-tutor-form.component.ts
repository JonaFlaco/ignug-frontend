import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { StudentModel, TeacherModel } from '@models/core';
import { PracticalCaseModel } from '@models/uic';
import { CreateMemorandumTutorDto, MemorandumTutorModel, UpdateMemorandumTutorDto } from '@models/uic/memorandum-tutor.model';
import {BreadcrumbService, CoreService, MessageService, StudentsHttpService, TeachersHttpService, } from '@services/core';
import { MemorandumTutorsHttpService, PracticalCasesHttpService } from '@services/uic';
import { StudentTypeEnum } from '@shared/enums/student.enum';
import {OnExitInterface} from '@shared/interfaces';

@Component({
  selector: 'app-memorandum-tutor-form',
  templateUrl:'./memorandum-tutor-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MemorandumTutorFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: MemorandumTutorModel[] = [];
  nameStudents: StudentModel[] = [];
  nameTeachers: TeacherModel[] = [];
  topics: PracticalCaseModel[] = [];
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
    private memorandumTutorsHttpService: MemorandumTutorsHttpService,
    private studentsHttpService: StudentsHttpService,
    private teachersHttpService: TeachersHttpService,
    private practicalCasesHttpService: PracticalCasesHttpService,
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
      this.panelHeader = 'Update MemorandumTutor';
    }
    this.types = [
      { name: 'Tutor caso práctico', code: 'TCP' },
    ];
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getMemorandumTutor();
    this.getStudents();
    this.getTeachers();
    this.getCases();
  }

  get newForm(): UntypedFormGroup {
    const currentDate = new Date();
    return this.formBuilder.group({
      type: [null, [Validators.required]],
      nameTeacher: [null, [Validators.required]],
      nameStudent: [null, [Validators.required]],
      topic: [null, [Validators.required]],
      dateWritten: [currentDate, Validators.required],
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

  create(memorandumTutor: CreateMemorandumTutorDto): void {
    this.memorandumTutorsHttpService.create(memorandumTutor).subscribe(memorandumTutor => {
      this.form.reset(memorandumTutor);
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

  getCases(): void {
    this.practicalCasesHttpService.findAll().subscribe((topics) => this.topics = topics);
  }

  getMemorandumTutor(): void {
    this.isLoadingSkeleton = true;
    this.memorandumTutorsHttpService.findOne(this.id).subscribe((memorandumTutor) => {
      this.isLoadingSkeleton = false;

      const dateWritten = new Date();
      if (dateWritten) {
        dateWritten.setDate(dateWritten.getDate() + 1);
        dateWritten.setDate(dateWritten.getDate() - 1);
      }

      this.form.patchValue({
        ...memorandumTutor,
        dateWritten,
      });
    });
  }



  update(memorandumTutor: UpdateMemorandumTutorDto): void {
    this.memorandumTutorsHttpService.update(this.id, memorandumTutor).subscribe((memorandumTutor) => {
      this.form.reset(memorandumTutor);
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

  get topicField() {
    return this.form.controls['topic'];
  }

  get dateWrittenField() {
    return this.form.controls['dateWritten'];
  }

}
