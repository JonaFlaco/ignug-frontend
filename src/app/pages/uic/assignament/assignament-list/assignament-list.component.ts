import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {AssignamentsHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { AssignamentModel, SelectAssignamentDto } from '@models/uic';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-assignament-list',
  templateUrl: './assignament-list.component.html',
  styleUrls: ['./assignament-list.component.scss'],
})
export class AssignamentListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.assignamentsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedAssignaments: AssignamentModel[] = [];
  selectedAssignament: SelectAssignamentDto = {};
  assignaments: AssignamentModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private assignamentsHttpService: AssignamentsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Asignacion de Fases'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }

  checkState(assignament: AssignamentModel): string {
    if (assignament.isEnable) return 'success';

  return 'danger';
  }

  findAll(page: number = 0) {
    this.assignamentsHttpService.findAll(page, this.search.value).subscribe((assignaments) => this.assignaments = assignaments);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'sort', header: 'Orden'},
      {field: 'name', header: 'Nombre'},
      {field: 'planning', header: 'Convocatoria'},
      {field: 'startDate', header: 'Fecha de inicio'},
      {field: 'endDate', header: 'Fecha fin'},
      {field: 'isEnable', header: 'Estado'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Update',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedAssignament.id)
            this.redirectEditForm(this.selectedAssignament.id);
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedAssignament.id)
            this.remove(this.selectedAssignament.id);
        },
      },
    ];
  }

  paginate(assignament: any) {
    this.findAll(assignament.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/assignaments', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/assignaments', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.assignamentsHttpService.remove(id).subscribe((assignament) => {
            this.assignaments = this.assignaments.filter(item => item.id !== assignament.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.assignamentsHttpService.removeAll(this.selectedAssignaments).subscribe((assignaments) => {
          this.selectedAssignaments.forEach(assignamentDeleted => {
            this.assignaments = this.assignaments.filter(assignament => assignament.id !== assignamentDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedAssignaments = [];
        });
      }
    });
  }

  selectAssignament(assignament: AssignamentModel) {
    this.selectedAssignament = assignament;
  }
}
