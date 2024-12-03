import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {PlanningsHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { PlanningModel, ReadPlanningDto, SelectPlanningDto } from '@models/uic';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-planification-tutor-list',
  templateUrl: './planification-tutor-list.component.html',
  styleUrls: ['./planification-tutor-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlanificationTutorListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.planningsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedPlannings: PlanningModel[] = [];
  selectedPlanning: SelectPlanningDto = {};
  plannings: PlanningModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private planningsHttpService: PlanningsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Planificación'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit() {
    this.findAll();
  }

  checkState(planning: PlanningModel): string {
    if (planning.state) return 'success';

    return 'danger';
  }

  findAll(page: number = 0) {
    this.planningsHttpService.findAll(page, this.search.value).subscribe((plannings) => this.plannings = plannings);
  }

  getColumns(): ColumnModel[] {
    return [
      { field: 'name', header: 'Nombre' },
      // {field: 'description', header: 'Descripción'},
      // {field: 'nameModality', header: 'Modalidad'},
      { field: 'startDate', header: 'Fecha Inico' },
      { field: 'endDate', header: 'Fecha Fin' },
      { field: 'state', header: 'Estado' },
    ];
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.planningsHttpService.remove(id).subscribe((planning) => {
            this.plannings = this.plannings.filter(item => item.id !== planning.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.planningsHttpService.removeAll(this.selectedPlannings).subscribe((plannings) => {
          this.selectedPlannings.forEach(planningDeleted => {
            this.plannings = this.plannings.filter(planning => planning.id !== planningDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedPlannings = [];
        });
      }
    });
  }

  selectPlanning(planning: ReadPlanningDto) {
    this.planningsHttpService.plannings = planning;
    this.selectedPlanning = planning;
  }
}
