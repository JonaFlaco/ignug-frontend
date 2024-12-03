import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, throwIfEmpty } from 'rxjs';
import { ColumnModel, PaginatorModel, StudentModel } from '@models/core';
import {
  BreadcrumbService,
  MessageService,
  StudentsHttpService,
} from '@services/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';
import {
  EnrollmentModel,
  SelectEnrollmentDto,
  SelectTeacherDto,
  TeacherModel,
} from '@models/uic';
import {
  EnrollmentsHttpService,
  HelpService,
  PlanningsHttpService,
  TeachersHttpService,
} from '@services/uic';
import { TheoricalNotesHttpService } from '@services/uic/theoretical-note-http.service';
import {
  CreateTheoricalNoteDto,
  SelectTheoricalNoteDto,
  TheoricalNoteModel,
  UpdateTheoricalNoteDto,
} from '@models/uic/theoretical-note.model';

@Component({
  selector: 'app-theoretical-note-list',
  templateUrl: './theoretical-note-list.component.html',
  styleUrls: ['./theorical-note.component.scss'],
})
export class TheoricalNoteListComponent implements OnInit {
  id: string = '';
  bloodTypes: TheoricalNoteModel[] = [];
  form: UntypedFormGroup = this.newForm;
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.helpService.loaded$;
  checked: boolean = true;
  columns: ColumnModel[];
  pagination$ = this.enrollmentsHttpService.pagination$;
  paginator: PaginatorModel = this.helpService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedTheoricals: TheoricalNoteModel[] = [];
  selectedTheorical: SelectTheoricalNoteDto = {};
  selectedEnrollments: EnrollmentModel[] = [];
  selectedEnrollment: EnrollmentModel = {
    id: '',
    student: {
      id: '',
      name: '',
      user: null,
      career: {
        id: '',
        name: '',
        degree: '',
      },
      identification_card: 1,
      note:null,
    },
    state: '',
    stateM: null,
    code: '',
    observation: '',
    registeredAt: undefined,
  };
  theoricals: StudentModel[] = [];
  actionButtons: MenuItem[] = [];
  enrollments: EnrollmentModel[] = [];
  planning: string;
  login: string;

  constructor(
    public authService: AuthService,
    private helpService: HelpService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private enrollmentsHttpService: EnrollmentsHttpService,
    private planningsHttpService: PlanningsHttpService,
    private theoricalNotesHttpService: TheoricalNotesHttpService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.breadcrumbService.setItems([
      { label: 'Colocar Nota del Examén Teórico' },
    ]);

    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => (this.paginator = pagination));
    this.search.valueChanges
      .pipe(debounceTime(10))
      .subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
    this.findActive();
  }

  findAll(page: number = 0) {
    this.enrollmentsHttpService
      .findAll(page, this.search.value)
      .subscribe((enrollments) => {
        this.enrollments = enrollments.filter(
          (enrollments) =>
            enrollments.state == 'Matriculado' &&
            enrollments.stateM == false &&
            enrollments.student.career.id ==
              this.authService.auth.teacher.career.id
        );
      });
  }

  getColumns(): ColumnModel[] {
    return [
      { field: 'identification_card', header: 'Cedúla' },
      { field: 'student', header: 'Estudiantes' },
      { field: 'state', header: 'Estado' },
    ];
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.selectedEnrollment.stateM = true;
      this.TheoricalNote(this.selectedEnrollment, this.form.value);
      this.findAll();
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

  create(theoricalNote: CreateTheoricalNoteDto): void {
    this.theoricalNotesHttpService
      .create(theoricalNote)
      .subscribe((theoricalNote) => {
        this.form.reset(theoricalNote);
      });
  }

  update(theoricalNote: UpdateTheoricalNoteDto): void {
    this.theoricalNotesHttpService
      .update(this.id, theoricalNote)
      .subscribe((theoricalNote) => {
        this.form.reset(theoricalNote);
        this.back();
      });
  }

  TheoricalNote(theoricalNote: EnrollmentModel, note: any): void {
    const updateTheoricalNote: CreateTheoricalNoteDto = {
      name: theoricalNote,
      note: parseInt(note.note),
      observations: 'a',
    };
    this.theoricalNotesHttpService
      .create(updateTheoricalNote)
      .subscribe((theoricalNote) => {});
  }

  back(): void {
    this.router.navigate(['/uic/theorical-notes']);
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedTheorical.id)
            this.redirectEditForm(this.selectedTheorical.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedTheorical.id) this.remove(this.selectedTheorical.id);
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/theorical-notes', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/theorical-notes', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.theoricalNotesHttpService.remove(id).subscribe((teacher) => {
          this.theoricals = this.theoricals.filter(
            (item) => item.id !== teacher.id
          );
          this.paginator.totalItems--;
        });
      }
    });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.theoricalNotesHttpService
          .removeAll(this.selectedTheoricals)
          .subscribe((theoricals) => {
            this.selectedTheoricals.forEach((theoricalDeleted) => {
              this.theoricals = this.theoricals.filter(
                (theorical) => theorical.id !== theoricalDeleted.id
              );
              this.paginator.totalItems--;
            });
            this.selectedTheoricals = [];
          });
      }
    });
  }

  selectTheorical(theorical: TeacherModel) {
    this.selectedTheorical = theorical;
  }

  selectEnrollment(enrollment: EnrollmentModel) {
    this.selectedEnrollment = enrollment;
  }

  findActive() {
    this.planningsHttpService.findActive().subscribe((planning) => {
      this.planning = planning.name;
    });
  }

  get noteField() {
    return this.form.controls['note'];
  }
}
