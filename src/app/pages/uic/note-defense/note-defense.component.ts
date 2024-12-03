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
import { BreadcrumbService, MessageService } from '@services/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';
import { HelpService } from '@services/uic';
import { RubricNotesHttpService } from '@services/uic/rubric-note-http.service';
import {
  RubricNoteModel,
  SelectRubricNoteDto,
} from '@models/uic/rubric-note.model';
import { NoteDefenseModel } from '@models/uic';

@Component({
  selector: 'app-note-defense',
  templateUrl: './note-defense.component.html',
})
export class NoteDefenseComponent implements OnInit {
  id: string = '';
  bloodTypes: NoteDefenseModel[] = [];
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.helpService.loaded$;
  columns: ColumnModel[];
  pagination$ = this.rubricNotesHttpService.pagination$;
  paginator: PaginatorModel = this.helpService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedRubricNotes: RubricNoteModel[] = [];
  selectedRubricNote: SelectRubricNoteDto = {};
  rubricNotes: RubricNoteModel[] = [];
  noteDefenses: NoteDefenseModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private helpService: HelpService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private rubricNotesHttpService: RubricNotesHttpService,
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
  }

  findAll(page: number = 0) {
    this.rubricNotesHttpService
      .findAll(page, this.search.value)
      .subscribe((rubricNotes) => {
        this.rubricNotes = rubricNotes;
        this.calculateNote();
      });
  }

  getColumns(): ColumnModel[] {
    return [
      { field: 'card', header: 'Cedúla' },
      { field: 'nameStudent', header: 'Nombre del Estudiante' },
      { field: 'score', header: 'Nota' },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  selectRubricNote(rubricNote: TeacherModel) {
    this.selectedRubricNote = rubricNote;
  }

  calculateNote() {
    let totalNote = 0;
    let student: StudentModel;
    let count = 0;
    for (let rubric of this.rubricNotes) {
      if (
        student &&
        rubric.student &&
        rubric.student.id != student.id
      ) {
        const divideNote = totalNote / count;
        const noteRounded= Math.round (divideNote);
        this.noteDefenses.push({
          score:noteRounded,
          nameStudent: student,
        });
        totalNote = 0;
        count = 0;
        console.log(noteRounded);
      }

      if (rubric.student) {
        student = rubric.student;
      }
      totalNote += parseFloat(rubric.note.toString());
      count++;
    }
    const divideNote = totalNote / count;
    const noteRounded= Math.round (divideNote);
    this.noteDefenses.push({
      score: noteRounded,
      nameStudent: student,
    });
  }
}
