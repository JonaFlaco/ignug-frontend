import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ColumnModel, PaginatorModel } from '@models/core';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';
import { id } from 'date-fns/locale';
import { UserModel } from '@models/auth';
import {
  RubricNoteModel,
  SelectRubricNoteDto,
} from '@models/uic/rubric-note.model';
import { IndividualDefensesHttpService } from '@services/uic';
import {
  IndividualDefenseModel,
  SelectIndividualDefenseDto,
} from '@models/uic/individual-defense.model';
import { RubricNotesHttpService } from '@services/uic/rubric-note-http.service';
import { NoteDefenseModel, SelectNoteDefenseDto } from '@models/uic';

@Component({
  selector: 'app-individual-defense',
  templateUrl: './individual-defense.component.html',
})
export class IndividualDefenseComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.rubricNotesHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedRubricNote: RubricNoteModel[] = [];
  selectedRubricNotes: SelectRubricNoteDto = {
    id: '',
    rubric: undefined,
    teacher: undefined,
    student: undefined,
    note: 0,
  };
  actionButtons: MenuItem[] = [];
  rubricNotes: RubricNoteModel[] = [];
  rubricNote: string;
  users: UserModel[] = [];
  message: string = 'Su nota de la defensa es superior a 70';

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private rubricNotesHttpService: RubricNotesHttpService
  ) {
    this.breadcrumbService.setItems([{ label: 'Notas finales' }]);
    this.columns = this.getColumns();
    this.pagination$.subscribe((pagination) => (this.paginator = pagination));
    this.search.valueChanges
      .pipe(debounceTime(500))
      .subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }

  // findAll(page: number = 0) {
  //   this.rubricNotesHttpService
  //     .findAll(page, this.search.value)
  //     .subscribe(
  //       (rubricNotes) =>
  //         (this.rubricNotes = rubricNotes.filter(
  //           (rubricNotes) =>
  //             rubricNotes.student.user.id == this.authService.auth.id
  //         ))
  //     );
  // }

  findAll(page: number = 0) {
    this.rubricNotesHttpService
      .findAll(page, this.search.value)
      .subscribe((rubricNotes) => {
          this.rubricNotes = rubricNotes.filter(
            (studentNote) =>
            studentNote.student.user.id == this.authService.auth.id
          );
          console.log(rubricNotes);
      });
  }

  onMessage(): string {
    console.log(this.selectedRubricNotes.note);
    if (this.rubricNotes.length > 0 && this.rubricNotes[0].note < 70) {
      this.message = 'Su nota del examén Practico es menor a 70';
      return 'error';
    }
    return 'success';
  }

  getColumns(): ColumnModel[] {
    return [
      { field: 'Defense', header: 'Evaluaciones' },
      { field: 'note', header: 'Notas' },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }
}
