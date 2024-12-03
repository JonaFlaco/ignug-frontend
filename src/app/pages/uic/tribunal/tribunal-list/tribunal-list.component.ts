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

@Component({
  selector: 'app-tribunal-list',
  templateUrl: './tribunal-list.component.html',
})
export class TribunalListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.tribunalsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedTribunals: TribunalModel[] = [];
  selectedTribunal: SelectTribunalDto = {};
  tribunals: TribunalModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private tribunalsHttpService: TribunalsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Tribunals'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }


  findAll(page: number = 0) {
    this.tribunalsHttpService.findAll(page, this.search.value).subscribe((tribunals) => this.tribunals = tribunals);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'name', header: 'Estudiante'},
      {field: 'president', header: 'Presidente'},
      {field: 'vocal', header: 'Vocal 1'},
      {field: 'tutor', header: 'Vocal 2'},
      {field: 'score', header: 'Nota Presidente'},
      {field: 'score2', header: 'Nota Vocal 1'},
      {field: 'score3', header: 'Nota Vocal 2'},
      {field: 'date', header: 'Fecha Defensa'},
      {field: 'place', header: 'Lugar Defensa'},

    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedTribunal.id)
            this.redirectEditForm(this.selectedTribunal.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedTribunal.id)
            this.remove(this.selectedTribunal.id);
        },
      },
    ];
  }

  paginate(tribunal: any) {
    this.findAll(tribunal.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/tribunals', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/tribunals', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.tribunalsHttpService.remove(id).subscribe((tribunal) => {
            this.tribunals = this.tribunals.filter(item => item.id !== tribunal.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.tribunalsHttpService.removeAll(this.selectedTribunals).subscribe((tribunals) => {
          this.selectedTribunals.forEach(tribunalDeleted => {
            this.tribunals = this.tribunals.filter(tribunal => tribunal.id !== tribunalDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedTribunals = [];
        });
      }
    });
  }

  selectTribunal(tribunal: TribunalModel) {
    this.selectedTribunal = tribunal;
  }
}
