import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, UntypedFormControl} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {SelectProjectPlanDto, ProjectPlanModel} from '@models/uic';
import {ColumnModel, PaginatorModel} from '@models/core';
import {ProjectPlansHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import {AuthService} from "@services/auth";


@Component({
  selector: 'app-project-plan-list',
  templateUrl: './project-plan-list.component.html',
  styleUrls: ['./project-plan-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectPlanListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.projectPlansHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedProjectPlans: ProjectPlanModel[] = [];
  selectedProjectPlan: SelectProjectPlanDto = {};
  projectPlans: ProjectPlanModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
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
    this.projectPlansHttpService.findAll(page, this.search.value).subscribe((projectPlans) => this.projectPlans = projectPlans);
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

  getActionButtons(projectPlan: any): MenuItem[] {
    let menu: MenuItem[] = [];
    if (!projectPlan.state) {
      return [];
    }
    if (projectPlan.state.toUpperCase()=="APROBADA"){
         menu= [{
          label: 'Visualizar',
          icon: 'pi pi-eye',
          routerLink: ['/project-plans/ver/'],
          // command: function (oEvent:any)  {
          //   console.log("ID", projectPlan);
          //   if (projectPlan.id)
          //     this.redirectViewForm(projectPlan.id);
          // }.bind(this),
        }]
    } else {
      menu = [{
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedProjectPlan.id)
            this.redirectEditForm(this.selectedProjectPlan.id);
        },
      }]

    }

    if (projectPlan.state.toUpperCase()=="PENDIENTE"){
      menu = [...menu, {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedProjectPlan.id)
            this.remove(this.selectedProjectPlan.id);
        },
      }]
 }console.log(menu);
    return menu;

  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    if (this.projectPlans.length <2) {
    this.router.navigate(['/uic/project-plans', 'new']);
  }
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/project-plans', id]);
  }

  redirectViewForm(id: string){
    console.log("ID",id);
    this.router.navigate(['/uic/project-plans/ver', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.projectPlansHttpService.remove(id).subscribe((projectPlan) => {
            this.projectPlans = this.projectPlans.filter(item => item.id !== projectPlan.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.projectPlansHttpService.removeAll(this.selectedProjectPlans).subscribe((projectPlans) => {
          this.selectedProjectPlans.forEach(ProjectPlanDeleted => {
            this.projectPlans = this.projectPlans.filter(projectPlan => projectPlan.id !== ProjectPlanDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedProjectPlans = [];
        });
      }
    });
  }

  selectProjectPlan(projectPlan: ProjectPlanModel) {
    this.selectedProjectPlan = projectPlan;
  }
}
