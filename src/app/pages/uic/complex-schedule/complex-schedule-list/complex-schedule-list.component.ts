import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ColumnModel, PaginatorModel } from '@models/core';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';
import { ComplexScheduleModel, SelectComplexScheduleDto } from '@models/uic';
import { ComplexSchedulesHttpService } from '@services/uic';

@Component({
  selector: 'app-complex-schedule-list',
  templateUrl: './complex-schedule-list.component.html',
})
export class ComplexScheduleListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.complexSchedulesHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedComplexSchedules: ComplexScheduleModel[] = [];
  selectedComplexSchedule: SelectComplexScheduleDto = {};
  complexSchedules: ComplexScheduleModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private complexSchedulesHttpService: ComplexSchedulesHttpService
  ) {
    this.breadcrumbService.setItems([{ label: 'Cronograma' }]);
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

  checkState(planning: ComplexScheduleModel): string {
    if (planning.state) return 'success';

    return 'danger';
  }

  findAll(page: number = 0) {
    this.complexSchedulesHttpService
      .findAll(page, this.search.value)
      .subscribe(
        (ComplexSchedules) => (this.complexSchedules = ComplexSchedules)
      );
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'sort', header: 'Orden'},
      { field: 'activity', header: 'Actividad' },
      { field: 'description', header: 'Descripción' },
      { field: 'startDate', header: 'Fecha de la reunion' },
      { field: 'endDate', header: 'Fecha de la reunion' },
      { field: 'state', header: 'Estado' },
    ];
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedComplexSchedule.id)
            this.redirectEditForm(this.selectedComplexSchedule.id);
        },
      },
    ];
  }

  paginate(ComplexSchedule: any) {
    this.findAll(ComplexSchedule.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/complex-schedules', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/complex-schedules', id]);
  }

  redirectCase() {
    this.router.navigate(['/uic/cronograma']);
  }

  remove(id: string) {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.complexSchedulesHttpService
          .remove(id)
          .subscribe((ComplexSchedule) => {
            this.complexSchedules = this.complexSchedules.filter(
              (item) => item.id !== ComplexSchedule.id
            );
            this.paginator.totalItems--;
          });
      }
    });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.complexSchedulesHttpService
          .removeAll(this.selectedComplexSchedules)
          .subscribe((ComplexSchedules) => {
            this.selectedComplexSchedules.forEach((ComplexScheduleDeleted) => {
              this.complexSchedules = this.complexSchedules.filter(
                (ComplexSchedule) =>
                  ComplexSchedule.id !== ComplexScheduleDeleted.id
              );
              this.paginator.totalItems--;
            });
            this.selectedComplexSchedules = [];
          });
      }
    });
  }

  selectComplexSchedule(ComplexSchedule: ComplexScheduleModel) {
    this.selectedComplexSchedule = ComplexSchedule;
  }
}
