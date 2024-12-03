import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { AuthService } from '@services/auth';
import { SelectTribunalDto, TribunalModel } from '@models/uic/tribunal.model';
import { TribunalsHttpService } from '@services/uic/tribunal-http.service';
import { NoteModel, SelectNoteDto, SelectScheduleActivityDto } from '@models/uic';
import { NotesHttpService } from '@services/uic';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
})
export class NoteListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.notesHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedNotes: NoteModel[] = [];
  selectedNote: SelectNoteDto = {};
  notes: NoteModel[] = [];
  actionButtons: MenuItem[] = [];
  selectedScheduleActivity: SelectScheduleActivityDto = {};

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private notesHttpService: NotesHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Seguimiento'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }

  checkState(note: NoteModel): string {
    if (note.state) return 'success';

    return 'danger';
  }

  redirectSchedule(id: string='') {
    this.router.navigate(['/uic/schedule-activities']);
  }


  findAll(page: number = 0) {
    this.notesHttpService.findAll(page, this.search.value).subscribe((notes) => this.notes = notes);
  }

  getColumns(): ColumnModel[] {
    return [
      { field: 'studentInformation', header: 'Estudiante' },
      { field: 'projectBench', header: 'Proyecto Asignado' },
      {field: 'description', header: 'Descripción del Sub-Caso'},
      {field: 'score', header: 'Revisión 1'},
      {field: 'score2', header: 'Revisión 2'},
      {field: 'score3', header: 'Revisión 3'},
      {field: 'score4', header: 'Nota Final'},
      {field: 'observation', header: 'Observaciones'},
      {field: 'state', header: 'Estado'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [

      {
        label: 'Revisar Actividades',
        icon: 'pi pi-check',

        command: () => {
            this.redirectSchedule();
        },

      },
      {
        label: 'Agregar Notas',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedNote.id)
            this.redirectEditForm(this.selectedNote.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedNote.id)
            this.remove(this.selectedNote.id);
        },
      },
    ];
  }

  paginate(note: any) {
    this.findAll(note.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/notes', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/notes', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.notesHttpService.remove(id).subscribe((note) => {
            this.notes = this.notes.filter(item => item.id !== note.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.notesHttpService.removeAll(this.selectedNotes).subscribe((notes) => {
          this.selectedNotes.forEach(noteDeleted => {
            this.notes = this.notes.filter(note => note.id !== noteDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedNotes = [];
        });
      }
    });
  }

  selectNote(note: NoteModel) {
    this.selectedNote = note;
  }
}
