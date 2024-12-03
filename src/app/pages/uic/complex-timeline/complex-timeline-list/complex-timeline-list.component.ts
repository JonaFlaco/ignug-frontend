import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ColumnModel, PaginatorModel } from '@models/core';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';
import { ComplexTimelineModel, SelectComplexTimelineDto } from '@models/uic';
import { ComplexTimelinesHttpService } from '@services/uic';

@Component({
  selector: 'app-complex-timeline-list',
  templateUrl: './complex-timeline-list.component.html',
})
export class ComplexTimelineListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.complexTimelinesHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedComplexTimelines: ComplexTimelineModel[] = [];
  selectedComplexTimeline: SelectComplexTimelineDto = {};
  complexTimelines: ComplexTimelineModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private complexTimelinesHttpService: ComplexTimelinesHttpService
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

  findAll(page: number = 0) {
    this.complexTimelinesHttpService
      .findAll(page, this.search.value)
      .subscribe(
        (complexTimelines) => (this.complexTimelines = complexTimelines)
      );
  }

  getColumns(): ColumnModel[] {
    return [
      { field: 'topicProject', header: 'Proyecto' },
      { field: 'activity', header: 'Actividad' },
      { field: 'meetingDate', header: 'Fecha de la reunion' },
      { field: 'description', header: 'Descripción' },
    ];
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedComplexTimeline.id)
            this.redirectEditForm(this.selectedComplexTimeline.id);
        },
      },
    ];
  }

  paginate(complexTimeline: any) {
    this.findAll(complexTimeline.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/complex-timelines', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/complex-timelines', id]);
  }

  redirectCase() {
    this.router.navigate(['/uic/case-views']);
  }

  remove(id: string) {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.complexTimelinesHttpService
          .remove(id)
          .subscribe((complexTimeline) => {
            this.complexTimelines = this.complexTimelines.filter(
              (item) => item.id !== complexTimeline.id
            );
            this.paginator.totalItems--;
          });
      }
    });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.complexTimelinesHttpService
          .removeAll(this.selectedComplexTimelines)
          .subscribe((complexTimelines) => {
            this.selectedComplexTimelines.forEach((complexTimelineDeleted) => {
              this.complexTimelines = this.complexTimelines.filter(
                (complexTimeline) =>
                  complexTimeline.id !== complexTimelineDeleted.id
              );
              this.paginator.totalItems--;
            });
            this.selectedComplexTimelines = [];
          });
      }
    });
  }

  selectComplexTimeline(complexTimeline: ComplexTimelineModel) {
    this.selectedComplexTimeline = complexTimeline;
  }
}
