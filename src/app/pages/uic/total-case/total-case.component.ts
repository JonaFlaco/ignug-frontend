import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
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
  EnrollmentsHttpService,
  HelpService,
  NoteSettingsHttpService,
  TotalCasesHttpService,
} from '@services/uic';
import { RubricNotesHttpService } from '@services/uic/rubric-note-http.service';
import { RubricNoteModel } from '@models/uic/rubric-note.model';
import {
  EnrollmentModel,
  NoteDefenseModel,
  NoteSettingModel,
  SelectTotalCaseDto,
  TotalCaseModel,
} from '@models/uic';
import { CatalogueTypeEnum } from '@shared/enums';
import { NoteCaseModel } from '@models/uic/note-case.model';

@Component({
  selector: 'app-total-case',
  templateUrl: './total-case.component.html',
})
export class TotalCaseComponent implements OnInit {
  id: string = '';
  bloodTypes: NoteDefenseModel[] = [];
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.helpService.loaded$;
  columns: ColumnModel[];
  pagination$ = this.totalCasesHttpService.pagination$;
  paginator: PaginatorModel = this.helpService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedTotalCases: TotalCaseModel[] = [];
  selectedTotalCase: SelectTotalCaseDto = {};
  totalCases: TotalCaseModel[];
  actionButtons: MenuItem[] = [];
  student: EnrollmentModel[] = [];
  setting: NoteSettingModel[] = [];
  score: RubricNoteModel[] = [];
  noteCase: NoteCaseModel[] = [];

  constructor(
    public authService: AuthService,
    private helpService: HelpService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private totalCasesHttpService: TotalCasesHttpService,
    private rubricNotesHttpService: RubricNotesHttpService,
    private noteSettingsHttpService: NoteSettingsHttpService,
    private enrollmentsHttpService: EnrollmentsHttpService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.breadcrumbService.setItems([{ label: 'Nota del Examén Práctico' }]);
    this.columns = this.getColumns();
    this.pagination$.subscribe((pagination) => (this.paginator = pagination));
    this.search.valueChanges
      .pipe(debounceTime(10))
      .subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
    this.getStudent();
    this.loadDefense();
    this.loadSetting();
    this.loadTotalNote();
  }

  findAll(page: number = 0) {
    this.totalCasesHttpService
      .findAll(page, this.search.value)
      .subscribe((totalCase) => {
        this.totalCases = totalCase;
      });
  }

  getColumns(): ColumnModel[] {
    return [
      { field: 'student', header: 'Nombre del Estudiante' },
      { field: 'setting', header: 'Nota del Desarrollo del Caso Practico' },
      { field: 'defense', header: 'Nota de la Defensa del Caso Practico' },
      { field: 'case', header: 'Nota del Examen Practico' },
      { field: 'percent', header: 'Nota del 60% Examen Practico' },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  selectTotalCase(totalCase: TotalCaseModel) {
    this.selectedTotalCase = totalCase;
  }

  getStudent(): void {
    this.isLoadingSkeleton = true;
    this.enrollmentsHttpService
      .catalogue(CatalogueTypeEnum.STUDENT)
      .subscribe((student) => {
        this.isLoadingSkeleton = false;
        this.student = student;
      });
  }

  loadDefense(): void {
    this.rubricNotesHttpService
      .findAll()
      .subscribe((score) => (this.score = score));
    console.log(this.score);
  }

  loadSetting(): void {
    this.noteSettingsHttpService.findAll().subscribe((setting) => {
      this.setting = setting;
    });
  }

  calculateFinalCase(setting: NoteSettingModel): number {
    return (
      (((parseInt(setting.document.toString()) + parseInt(setting.evaluation.toString())) / 2 +
        parseInt(setting.student.note[0]?.note.toString()))/2)
    );
  }

  calculatePercentCase(setting: NoteSettingModel): number {
    return (
      (((parseInt(setting.document.toString()) + parseInt(setting.evaluation.toString())) / 2 +
        parseInt(setting.student.note[0]?.note.toString()))/2)*0.6
    );
  }

  //desarrollo del caso practico
  showPracticalNote(noteSetting: NoteSettingModel): number {
    const noteDocument = noteSetting.document * 0.5;
    const noteEvaluation = noteSetting.evaluation * 0.5;
    let evaluation = (noteDocument + noteEvaluation) * 0.6;
    return evaluation;
  }

  //la suma del caso practico con el caso teorico
  loadTotalNote(): void {
    this.noteCase = this.setting.map((settingNote) => {
      const defenseNote: RubricNoteModel = this.score.find(
        (defenseNote) => settingNote.student.id == defenseNote.student.id
      );
      const totalScore =
        defenseNote.note * 0.4 + this.showPracticalNote(settingNote);
      return {
        student: settingNote.student,
        practicalNote: this.showPracticalNote(settingNote),
        defenseNote: defenseNote.note,
        totalScore,
      };
    });
  }
}
