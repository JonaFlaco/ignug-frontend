import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ColumnModel, PaginatorModel } from '@models/core';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';
import { ScheduleActivityModel, SelectScheduleActivityDto } from '@models/uic';
import { ScheduleActivitiesHttpService } from '@services/uic';

@Component({
  selector: 'app-schedule-activity-list',
  templateUrl: './schedule-activity-list.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ScheduleActivityListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.scheduleActivitiesHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedScheduleActivities: ScheduleActivityModel[] = [];
  selectedScheduleActivity: SelectScheduleActivityDto = {};
  scheduleActivities: ScheduleActivityModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private scheduleActivitiesHttpService: ScheduleActivitiesHttpService
  ) {
    this.breadcrumbService.setItems([{ label: 'Cronograma del Tutor' }]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }

  checkState(planning: ScheduleActivityModel): string {
    if (planning.state) return 'success';

    return 'danger';
  }

  findAll(page: number = 0) {
    this.scheduleActivitiesHttpService
      .findAll(page, this.search.value)
      .subscribe(
        (ScheduleActivities) => (this.scheduleActivities = ScheduleActivities)
      );
  }

  getColumns(): ColumnModel[] {
    return [
      { field: 'assignment', header: 'Actividad' },
      { field: 'description', header: 'Descripción' },
      { field: 'startDate', header: 'Fecha de inicio' },
      { field: 'endDate', header: 'Fecha de fin' },
      { field: 'state', header: 'Estado' },
    ];
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedScheduleActivity.id)
            this.redirectEditForm(this.selectedScheduleActivity.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedScheduleActivity.id)
            this.remove(this.selectedScheduleActivity.id);
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/schedule-activities', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/schedule-activities', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.scheduleActivitiesHttpService.remove(id).subscribe((scheduleActivity) => {
            this.scheduleActivities = this.scheduleActivities.filter(item => item.id !== scheduleActivity.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.scheduleActivitiesHttpService.removeAll(this.selectedScheduleActivities).subscribe((scheduleActivities) => {
          this.selectedScheduleActivities.forEach(scheduleActivityDeleted => {
            this.scheduleActivities = this.scheduleActivities.filter(scheduleActivity => scheduleActivity.id !== scheduleActivityDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedScheduleActivities = [];
        });
      }
    });
  }

  selectScheduleActivity(scheduleActivity: ScheduleActivityModel) {
    this.selectedScheduleActivity = scheduleActivity;
  }
}
