import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ColumnModel, PaginatorModel } from '@models/core';
import { ProjectPlanModel, ResponseProjectPlanModel, SelectResponseProjectPlanDto} from '@models/uic';
import { CoreService, MessageService, BreadcrumbService } from '@services/core';
import { ProjectPlansHttpService, ResponseProjectPlansHttpService} from '@services/uic';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-response-request-project-plan-list',
  templateUrl: './response-request-project-plan-list.component.html',
})
export class ResponseRequestProjectPlanListComponent implements OnInit {

  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.responseProjectPlansHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedResponseProjectPlans: ResponseProjectPlanModel[] = [];
  selectedResponseProjectPlan: SelectResponseProjectPlanDto = {};
  responseProjectPlans: ProjectPlanModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private responseProjectPlansHttpService: ResponseProjectPlansHttpService,
    private projectPlansHttpService: ProjectPlansHttpService,

  ) {
    this.breadcrumbService.setItems([
      {label: 'Solicitudes de Ante-Proyecto'}
    ]);
    this.columns = this.getColumns();
    // this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit() {
    this.findAll();
  }

  findAll(page: number = 0) {
    this.projectPlansHttpService.findAll(page, this.search.value).subscribe((projectPlans) => this.responseProjectPlans = projectPlans);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'title', header: 'Titulo'},
      {field: 'studentSelect', header: 'Compañero'},
      {field: 'tutor', header: 'Docente Tutor'},
      {field: 'requestedAt', header: 'Fecha de solicitud'},
      {field: 'answeredAt', header: 'Fecha de respuesta'},
      {field: 'state', header: 'Estado'},

    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Responder',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedResponseProjectPlan.id)
            this.redirectEditForm(this.selectedResponseProjectPlan.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedResponseProjectPlan.id)
            this.remove(this.selectedResponseProjectPlan.id);
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/response-request-project-plans', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/response-request-project-plans', id]);
  }

  redirectViewForm(id: string){
    console.log("ID",id);
    this.router.navigate(['/uic/project-plans/ver', id]);
  }

  redirectListForm() {
    this.router.navigate(['/uic/response-project-plans']);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.responseProjectPlansHttpService.remove(id).subscribe((responseProjectPlan) => {
            this.selectedResponseProjectPlans = this.selectedResponseProjectPlans.filter(item => item.id !== responseProjectPlan.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.responseProjectPlansHttpService.removeAll(this.selectedResponseProjectPlans).subscribe((responseProjectPlans) => {
          this.selectedResponseProjectPlans.forEach(responseProjectPlanDeleted => {
            this.selectedResponseProjectPlans = this.selectedResponseProjectPlans.filter(selectedResponseProjectPlan => selectedResponseProjectPlan.id !== responseProjectPlanDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedResponseProjectPlans = [];
        });
      }
    });
  }

  selectResponseProjectPlan(responseProjectPlan: ResponseProjectPlanModel) {
    this.selectedResponseProjectPlan = responseProjectPlan;
  }

}
