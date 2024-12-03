import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnModel, PaginatorModel } from '@models/core';
import { CatalogueModel, ReadPlanningDto, RequirementModel, SelectRequirementDto } from '@models/uic';
import { AuthService } from '@services/auth';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { PlanningsHttpService, RequirementsHttpService, CataloguesHttpService } from '@services/uic';
import { MenuItem } from 'primeng/api';
import { debounceTime } from 'rxjs';


@Component({
  selector: 'app-requirement-list',
  templateUrl: './requirement-list.component.html',
  styleUrls: ['./requirement-list.component.scss']
})
export class RequirementListComponent implements OnInit {
  planning:ReadPlanningDto = {}
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.requirementsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedRequirements: RequirementModel[] = [];
  selectedRequirement: SelectRequirementDto = {};
  requirements: RequirementModel[] = [];
  catalogues:CatalogueModel[]=[];
  actionButtons: MenuItem[] = [];


  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private requirementsHttpService: RequirementsHttpService,
    private planningsHttpService: PlanningsHttpService,
    private cataloguesHttpService: CataloguesHttpService,


  ) {
    this.breadcrumbService.setItems([
      {label: 'Convocatorias', routerLink: ['/uic/plannings']},
      {label: 'Asignación de Requerimientos'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
    this.planning = planningsHttpService.plannings
  }

  ngOnInit(){
    const planningId = this.route.snapshot.paramMap.get('planningId');
    this.findByPlanning(0, planningId);
  }

  

  findAll(page: number = 0) {
    this.cataloguesHttpService.findAll(page, this.search.value).subscribe((catalogues) =>
    this.catalogues = catalogues.filter((catalogues)=>catalogues.state==true));
  }


  findByPlanning(page: number = 0,planningId:string = '') {
    this.requirementsHttpService.findByPlanning(page, this.search.value,planningId).subscribe((requirements) => this.requirements = requirements);
  }


  getColumns(): ColumnModel[] {
    return [
      {field: 'nameCatalogue', header: 'Nombre del requerimiento'},
      {field: 'description', header: 'Descripción'},

    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedRequirement.id)
            this.redirectEditForm(this.selectedRequirement.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedRequirement.id)
            this.remove(this.selectedRequirement.id);
        },
      },

    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/requirements', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/requirements', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.requirementsHttpService.remove(id).subscribe((requirements) => {
            this.requirements = this.requirements.filter(item => item.id !== requirements.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.requirementsHttpService.removeAll(this.selectedRequirements).subscribe((requirements) => {
          this.selectedRequirements.forEach(requirementDeleted => {
            this.requirements = this.requirements.filter(requirement => requirement.id !== requirementDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedRequirements = [];
        });
      }
    });
  }

  selectRequirement(requirement: RequirementModel) {
    this.selectedRequirement = requirement;
  }

}
