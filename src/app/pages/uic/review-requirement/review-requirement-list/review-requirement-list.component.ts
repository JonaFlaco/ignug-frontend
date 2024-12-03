import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { FormatModel, ReadPlanningDto, RequirementModel, SelectFormatDto, SelectRequirementDto } from '@models/uic';
import { AuthService } from '@services/auth';
import { PlanningsHttpService, RequirementsHttpService } from '@services/uic';
import { StatusEnum } from '@shared/enums';

@Component({
  selector: 'app-review-requirement-list',
  templateUrl: './review-requirement-list.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ReviewRequirementListComponent implements OnInit {
  planning:ReadPlanningDto = {}
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.requirementsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedRequirements: RequirementModel[] = [];
  selectedRequirement: SelectRequirementDto = {};
  reviewRequirements: RequirementModel[] = [];
  requirements: RequirementModel[] = [];
  actionButtons: MenuItem[] = [];
  formats: FormatModel[] = [];
  selectedFormat: SelectFormatDto = {};

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private reviewRequirementsHttpService: RequirementsHttpService,
    private requirementsHttpService: RequirementsHttpService,
    private planningsHttpService: PlanningsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Listado de matriculados', routerLink: ['/uic/inscriptions']},
      {label: 'Validar Documentos'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit() {
    this.findActive();

  }

  findAll(page: number = 0) {
    this.requirementsHttpService.findAll(page, this.search.value).subscribe((requirements) => this.requirements = requirements);
  }

  findByPlanning(page: number = 0,planningId:string = '') {
    this.requirementsHttpService.findByPlanning(page, this.search.value,planningId).subscribe((requirements) => this.requirements = requirements);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'nameCatalogue', header: 'Nombre del requerimiento'},
      {field: 'status', header: 'Estado'},
    ]
  }

  obtainFile(id: string): void {
     const filename = `DEFENSA DE TITULACIÓN.docx`;
    this.requirementsHttpService.download(filename).subscribe((res) => {
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(res);
      link.download = filename;
      link.click();

    });
   }


  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Validar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedRequirement.id)
            this.redirectEditForm(this.selectedRequirement.id);
        },
      },
      {
        label: 'Cambiar Estado',
        icon: 'pi pi-check',
        items: [
          {
            label: 'Aprobar',
            icon: 'pi pi-check-circle',
            command: () => {
              if (this.selectedRequirement.id)
                this.changeStatus(
                  this.selectedRequirement.id,
                  StatusEnum.ACTIVE
                );
            },
          },
          {
            icon: 'pi pi-minus-circle',
            label: 'Rechazar',
            command: () => {
              if (this.selectedRequirement.id)
                this.changeStatus(
                  this.selectedRequirement.id,
                  StatusEnum.INACTIVE
                );
            },
          },
        ],
      },
      {
        label: 'Descargar Archivo',
        icon: 'pi pi-file-pdf',
        command: () => this.obtainFile(this.selectedRequirement.id),
      },
    ];
  }

  changeStatus(id: string, statusP: StatusEnum) {
    this.messageService
      .questionApprove(`¿Está seguro de cambiar el estado a ${statusP}?`,'No se puede cambiar después')
      .then((result) => {
        if (result.isConfirmed) {
          const filterResult = {
            status: statusP,
          };
          this.requirementsHttpService.changeStatus(id, filterResult).subscribe(() => {
            this.findActive();
          });
        }
      });
  }



  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/review-requirements', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/inscriptions']);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.requirementsHttpService.remove(id).subscribe((requirements) => {
            this.reviewRequirements = this.reviewRequirements.filter(item => item.id !== requirements.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.requirementsHttpService.removeAll(this.selectedRequirements).subscribe((requirements) => {
          this.selectedRequirements.forEach(reviewRequirementsDeleted => {
            this.reviewRequirements = this.reviewRequirements.filter(reviewRequirements => reviewRequirements.id !== reviewRequirementsDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedRequirements = [];
        });
      }
    });
  }

  selectRequirements(reviewRequirement: RequirementModel) {
    this.selectedRequirement = reviewRequirement;
  }

  findActive () {
    this.planningsHttpService.findActive().subscribe(planning=>{
      this.planning=planning;
      this.findByPlanning(0, planning.id);
    })
  }

  checkState(condicion: string): string {
    if (condicion == StatusEnum.ACTIVE) return 'success';
    if (condicion == StatusEnum.INACTIVE) return 'danger';

    return 'warning';
  }

  selectFormat(format: FormatModel) {
    this.selectedFormat = format;
  }

}
