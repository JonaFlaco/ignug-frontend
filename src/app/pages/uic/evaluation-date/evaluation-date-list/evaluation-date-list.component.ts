import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { AuthService } from '@services/auth';
import { SelectEvaluationDateDto, EvaluationDateModel } from '@models/uic';
import { EvaluationDateHttpService } from '@services/uic';

@Component({
  selector: 'app-evaluation-date-list',
  templateUrl: './evaluation-date-list.component.html',
})
export class EvaluationDateListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.evaluationDateHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedEvaluationDates: EvaluationDateModel[] = [];
  selectedEvaluationDate: SelectEvaluationDateDto = {};
  evaluationDate: EvaluationDateModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private evaluationDateHttpService:EvaluationDateHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Teachers'}
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
    this.evaluationDateHttpService.findAll(page, this.search.value).subscribe((evaluationDate) => this.evaluationDate = evaluationDate);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'dni', header: 'Cedula del tutor'},
      {field: 'tutor', header: 'Nombre del tutor'},

    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedEvaluationDate.id)
            this.redirectEditForm(this.selectedEvaluationDate.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedEvaluationDate.id)
            this.remove(this.selectedEvaluationDate.id);
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/evaluation-date', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/evaluation-date', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.evaluationDateHttpService.remove(id).subscribe((teacher) => {
            this.evaluationDate = this.evaluationDate.filter(item => item.id !== teacher.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.evaluationDateHttpService.removeAll(this.selectedEvaluationDates).subscribe((evaluaitonDate) => {
          this.selectedEvaluationDates.forEach(evaluationDateDeleted => {
            this.evaluationDate = this.evaluationDate.filter(evaluationDate => evaluationDate.id !== evaluationDateDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedEvaluationDates = [];
        });
      }
    });
  }

  selectEvaluationDate(evaluationDate: EvaluationDateModel) {
    this.selectedEvaluationDate = evaluationDate;
  }
}
