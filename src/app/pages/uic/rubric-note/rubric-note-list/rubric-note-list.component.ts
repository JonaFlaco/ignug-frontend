import { Component, OnInit} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, throwIfEmpty } from 'rxjs';
import {
  ColumnModel,
  PaginatorModel,
  StudentModel,
  TeacherModel,
} from '@models/core';
import {
  BreadcrumbService,
  MessageService,
  StudentsHttpService,
} from '@services/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';
import {
  RubricModel,
} from '@models/uic';
import {

  HelpService,
  RubricsHttpService,
} from '@services/uic';
import {
  TheoricalNoteModel,
} from '@models/uic/theoretical-note.model';
import { RubricNotesHttpService } from '@services/uic/rubric-note-http.service';
import {
  CreateRubricNoteDto,
  RubricNoteModel,
  SelectRubricNoteDto,
  UpdateRubricNoteDto,
} from '@models/uic/rubric-note.model';
import { CatalogueTypeEnum } from '@shared/enums';

@Component({
  selector: 'app-rubric-note-list',
  templateUrl: './rubric-note-list.component.html',
})
export class RubricNoteListComponent implements OnInit {
  id: string = '';
  bloodTypes: RubricNoteModel[] = [];
  form: UntypedFormGroup = this.newForm;
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.helpService.loaded$;
  columns: ColumnModel[];
  pagination$ = this.rubricsHttpService.pagination$;
  paginator: PaginatorModel = this.helpService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedRubricNotes: RubricNoteModel[] = [];
  selectedRubricNote: SelectRubricNoteDto = {};
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
  rubricNotes: RubricNoteModel[] = [];
  actionButtons: MenuItem[] = [];
  rubrics: RubricNoteModel[] = [];
  planning: string;
  teacher: TeacherModel[];
  student: StudentModel[];
  students: StudentModel[] = [];

  constructor(
    public authService: AuthService,
    private helpService: HelpService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private rubricsHttpService: RubricsHttpService,
    private rubricNotesHttpService: RubricNotesHttpService,
    private formBuilder: UntypedFormBuilder,
    private studentsHttpService: StudentsHttpService
  ) {
    this.breadcrumbService.setItems([
      { label: 'Colocar Nota del Examén Práctico' },
    ]);
    this.columns = this.getColumns();
    this.pagination$.subscribe((pagination) => (this.paginator = pagination));
    this.search.valueChanges
      .pipe(debounceTime(10))
      .subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
    this.getNameStudents();
  }


  findAll(page: number = 0) {
    this.rubricNotesHttpService
      .findAll(page, this.search.value)
      .subscribe((rubrics) => (this.rubrics = rubrics));
  }

  getNameStudents(): void {
    this.isLoadingSkeleton = true;
    this.studentsHttpService
      .nameStudent(CatalogueTypeEnum.STUDENT)
      .subscribe((nameStudents) => {
        this.isLoadingSkeleton = false;
        this.students = nameStudents;
      });
  }

  getColumns(): ColumnModel[] {
    return [
      { field: 'teacher', header: 'Docente Calificador' },
      { field: 'student', header: 'Nombre del Estudiante' },
      { field: 'note', header: 'Nota' },
    ];
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.RubricNote(this.selectedRubric, this.form.value);
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields.then();
    }
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      note: [
        100,
        [Validators.required, Validators.min(10), Validators.max(100)],
      ],
    });
  }

  create(rubricNote: CreateRubricNoteDto): void {
    this.rubricNotesHttpService.create(rubricNote).subscribe((rubricNote) => {
      this.form.reset(rubricNote);
    });
  }

  update(rubricNote: UpdateRubricNoteDto): void {
    this.rubricNotesHttpService
      .update(this.id, rubricNote)
      .subscribe((rubricNote) => {
        this.form.reset(rubricNote);
        this.back();
      });
  }

  RubricNote(rubricNote: RubricModel, note: any): void {
    const updateRubricNote: CreateRubricNoteDto = {
      rubric: rubricNote,
      note: parseInt(note.note),
      teacher: this.authService.teacher,
      student: this.student[0]
    };
    this.rubricNotesHttpService
      .create(updateRubricNote)
      .subscribe((rubricNote) => {});
  }

  back(): void {
    this.router.navigate(['/uic/rubric-notes']);
  }


  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/rubric-notes', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.rubricNotesHttpService.remove(id).subscribe((teacher) => {
          this.rubrics = this.rubrics.filter((item) => item.id !== teacher.id);
          this.paginator.totalItems--;
        });
      }
    });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.rubricNotesHttpService
          .removeAll(this.selectedRubricNotes)
          .subscribe((rubrics) => {
            this.selectedRubricNotes.forEach((rubricDeleted) => {
              this.rubrics = this.rubrics.filter(
                (rubric) => rubric.id !== rubricDeleted.id
              );
              this.paginator.totalItems--;
            });
            this.selectedRubricNotes = [];
          });
      }
    });
  }

  selectRubricNote(rubricNote: RubricNoteModel) {
    this.selectedRubricNote = rubricNote;
  }

  selectRubric(rubric: RubricModel) {
    this.selectedRubric = rubric;
  }


  get noteField() {
    return this.form.controls['note'];
  }

  get enrollmentField() {
    return this.form.controls['enrollment'];
  }

}
