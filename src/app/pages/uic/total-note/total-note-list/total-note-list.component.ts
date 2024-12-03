import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ColumnModel, PaginatorModel } from '@models/core';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';
import { SelectTotalNoteDto, TotalNoteModel } from '@models/uic';
import { TotalNotesHttpService } from '@services/uic';
import { TheoricalNotesHttpService } from '@services/uic/theoretical-note-http.service';
import { TheoricalNoteModel } from '@models/uic/theoretical-note.model';
import { id } from 'date-fns/locale';
import { UserModel } from '@models/auth';

@Component({
  selector: 'app-total-note-list',
  templateUrl: './total-note-list.component.html',
  styleUrls: ['./total-note-list.component.scss'],
})
export class TotalNoteListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.totalNoteHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedTheoricals: TheoricalNoteModel = {
    id: '',
    name: undefined,
    note: 0,
    observations: ''
  };
  selectedTotalNote: SelectTotalNoteDto = {};
  totalNotes: TotalNoteModel[] = [];
  actionButtons: MenuItem[] = [];
  theoricals: TheoricalNoteModel[] = [];
  theorical: string;
  users: UserModel[] = [];
  message: string = 'Su nota del examén teórico es mayor a 70, usted esta aprobado';

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private totalNoteHttpService: TotalNotesHttpService,
    private theoricalNotesHttpService: TheoricalNotesHttpService
  ) {
    this.breadcrumbService.setItems([{ label: 'Notas del Examén Teótico' }]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => (this.paginator = pagination));
    this.search.valueChanges
      .pipe(debounceTime(500))
      .subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(page: number = 0) {
    this.theoricalNotesHttpService
      .findAllbyUser(page, this.search.value)
      .subscribe(
        (theoricals) =>
          (this.theoricals = theoricals.filter(
            (theoricals) => theoricals.name.student.user.id == this.authService.auth.id
          ))
      );
  }

  onMessage(): string {
    //console.log(this.selectedTheoricals.note)
    if (this.theoricals[0].note < 70) {
      this.message = 'Su nota del examén teórico es menor a 70, usted debe rendir recuperación'
      return 'error'
    }
    return 'success'
  }

  gradeNote(){
    let total=0;
    if(!this.theoricals){
      return total;
    }
    this.theoricals.forEach(rubric =>{
    total+= parseFloat(rubric.note.toString());
    });
    const notaRedondeada: string =  (total.toFixed(0))
    total*=0.4;
    const notaComoNumero: number = Math.round(total);
    return total;

  }

  getColumns(): ColumnModel[] {
    return [
      { field: 'Exteorico', header: 'Evaluaciones' },
      { field: 'note', header: 'Calificación' },
    ];
  }

  getActionButtons(): MenuItem[] {
    return [
      // {
      //   label: 'Actualizar',
      //   icon: 'pi pi-pencil',
      //   command: () => {
      //     if (this.selectedTotalNote.id)
      //       this.redirectEditForm(this.selectedTotalNote.id);
      //   },
      // },
      // {
      //   label: 'Eliminar',
      //   icon: 'pi pi-trash',
      //   command: () => {
      //     if (this.selectedTotalNote.id) this.remove(this.selectedTotalNote.id);
      //   },
      //   disabled: !this.selectedTotalNote.id || this.totalNotes.length === 1,
      // },
      // {
      //   label: 'Eliminar',
      //   icon: 'pi pi-trash',
      //   command: () => {
      //     if (this.selectedTotalNote.id) this.remove(this.selectedTotalNote.id);
      //   },
      // },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    if (this.totalNotes.length === 0) {
      this.router.navigate(['/uic/total-notes', 'new']);
    }
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/total-notes', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.totalNoteHttpService.remove(id).subscribe((totalNote) => {
          this.totalNotes = this.totalNotes.filter(
            (item) => item.id !== totalNote.id
          );
          this.paginator.totalItems--;
        });
      }
    });
  }

  // removeAll() {
  //   this.messageService.questionDelete().then((result) => {
  //     if (result.isConfirmed) {
  //       this.totalNoteHttpService
  //         .removeAll(this.selectedTotalNotes)
  //         .subscribe((totalNotes) => {
  //           this.selectedTotalNotes.forEach((totalNoteDeleted) => {
  //             this.totalNotes = this.totalNotes.filter(
  //               (totalNote) => totalNote.id !== totalNoteDeleted.id
  //             );
  //             this.paginator.totalItems--;
  //           });
  //           this.selectedTotalNotes = [];
  //         });
  //     }
  //   });
  // }

  selectTotalNote(totalNote: TotalNoteModel) {
    this.selectedTotalNote = totalNote;
  }

  // findActive () {
  //   this.theoricalNotesHttpService.findAll().subscribe(theorical=>{
  //     this.theorical = theorical.note;
  //   })
  // }
}
