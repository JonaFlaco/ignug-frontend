import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import {
  CareerModel,
  ColumnModel,
  PaginatorModel,
  StudentModel,
  TeacherModel,
} from '@models/core';
import {
  BreadcrumbService,
  CoreService,
  MessageService,
  StudentsHttpService,
} from '@services/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';
import {
  EnrollmentModel,
  ItemModel,
  RubricModel,
  SelectEnrollmentDto,
} from '@models/uic';
import { RubricsHttpService } from '@services/uic';
import { CreateRubricNoteDto } from '@models/uic/rubric-note.model';
import { RubricNotesHttpService } from '@services/uic/rubric-note-http.service';
import { CatalogueTypeEnum } from '@shared/enums';
import { EnrollmentsHttpService } from '@services/uic/enrollment-http.service';

@Component({
  selector: 'app-rubric-list',
  templateUrl: './rubric-list.component.html',
})
export class RubricListComponent implements OnInit {
  id: string = '';
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.rubricsHttpService.pagination$;
  isLoadingSkeleton: boolean = false;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedRubrics: RubricModel[] = [];
  selectedRubric: RubricModel = {
    id: '',
    criterio: '',
    criterio2: '',
    criterio3: '',
    criterio4: '',
    criterio5: '',
    nameStudent: null,
    item: null,
  };
  selectedEnrollment: SelectEnrollmentDto = {};
  rubrics: RubricModel[] = [];
  logoDataUrl: string;
  items: ItemModel[] = [];
  actionButtons: MenuItem[] = [];
  careers: CareerModel[] = [];
  form: UntypedFormGroup = this.newForm;
  totalNote = 0;
  rubricNotes: any[] = [];
  teacher: TeacherModel[] = [];
  nameStudents: StudentModel[] = [];
  students: EnrollmentModel[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private rubricsHttpService: RubricsHttpService,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private rubricNotesHttpService: RubricNotesHttpService,
    private studentsHttpService: StudentsHttpService,
    private enrollmentsHttpService: EnrollmentsHttpService
  ) {
    this.breadcrumbService.setItems([{ label: 'Rubricas' }]);
    this.columns = this.getColumns();
    this.pagination$.subscribe((pagination) => (this.paginator = pagination));
    this.search.valueChanges
      .pipe(debounceTime(500))
      .subscribe((_) => this.findAll());
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
    }
  }

  ngOnInit(): void {
    this.findAll();
    this.getNameStudents();
  }

  findAll(page: number = 0) {
    const careerId = this.route.snapshot.paramMap.get('id');
    this.findByCareer(0, careerId);
  }

  findByCareer(page: number = 0, careerId: string) {
    this.rubricsHttpService
      .findByCareer(page, this.search.value, careerId)
      .subscribe((rubrics) => (this.rubrics = rubrics));
  }

  getColumns(): ColumnModel[] {
    return [
      { field: 'item', header: 'Criterio' },
      { field: 'criterio', header: 'Item 1' },
      { field: 'criterio2', header: 'Item  2' },
      { field: 'criterio3', header: 'Item  3' },
      { field: 'criterio4', header: 'Item  4' },
      { field: 'criterio5', header: 'Item  5' },
    ];
  }

  getItems(): void {
    this.rubricsHttpService.findOne(this.id).subscribe((rubric) => {
      this.items = rubric.item;
    });
  }

  getNameStudents(): void {
    this.isLoadingSkeleton = true;
    this.enrollmentsHttpService
      .catalogue(CatalogueTypeEnum.STUDENT)
      .subscribe((nameStudents) => {
        this.isLoadingSkeleton = false;
        this.students = nameStudents.filter(
          (enrollments) => enrollments.state == 'Matriculado'
          && enrollments.student.career.id == this.authService.auth.teacher.career.id
        );
      });
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/rubrics', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/rubrics', id]);
  }

  selectRubric(rubric: RubricModel) {
    this.selectedRubric = rubric;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.RubricNote(this.selectedRubric, this.form.value);
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields.then();
    }
  }

  createRubric() {
    let finalNote = 0;
    this.rubricNotes.forEach((rubricNote) => {
      finalNote += parseFloat(rubricNote.note);
    });
    finalNote /= this.rubricNotes.length;
    this.rubricNotes[0].note = Math.round(finalNote);
    this.saveRubric(this.rubricNotes[0]);
  }

  selectStudent(event: any) {
    this.enrollmentField.setValue(event.value);
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      note: [0, [Validators.required, Validators.min(10), Validators.max(100)]],
      enrollment: ['hola', [Validators.required]],
    });
  }

  get noteField() {
    return this.form.controls['note'];
  }

  get enrollmentField(): AbstractControl {
    return this.form.controls['enrollment'];
  }

  RubricNote(rubricNote: RubricModel, note: any) {
    const updateRubricNote: CreateRubricNoteDto = {
      rubric: rubricNote,
      note: parseInt(note.note),
      teacher: this.authService.teacher,
      student: this.enrollmentField.value.student,
    };
    this.rubricNotesHttpService
      .create(updateRubricNote)
      .subscribe((rubricNote) => {
        this.totalNote += rubricNote.note;
      });
  }

  saveRubric(updateRubricNote: any) {
    this.rubricNotesHttpService
      .create(updateRubricNote)
      .subscribe((rubricNote) => {
        this.totalNote += rubricNote.note;
      });
  }

  addRubricNote(rubricNote: RubricModel, note: any) {
    note = note.target.value;
    const updateRubricNote: CreateRubricNoteDto = {
      rubric: rubricNote,
      note: parseInt(note.note),
      teacher: this.authService.teacher,
      student: this.enrollmentField.value.student,
    };
    const index = this.rubricNotes.findIndex(
      (item) => item.rubric.id === rubricNote.id
    );
    if (index > -1) {
      this.rubricNotes[index].note = note;
    } else {
      this.rubricNotes.push(updateRubricNote);
    }
  }

  showNote(): boolean {
    const isTeacher = this.authService.roles.some(
      (role) => role.code == 'teacher'
    );
    return !isTeacher;
  }
}
