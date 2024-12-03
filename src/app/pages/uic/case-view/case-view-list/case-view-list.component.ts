import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { AuthService } from '@services/auth';
import { CaseViewModel, SelectCaseViewDto, UploadProjectModel } from '@models/uic';
import { CaseViewsHttpService, UploadProjectsHttpService } from '@services/uic';

@Component({
  selector: 'app-case-view-list',
  templateUrl: './case-view-list.component.html',
})
export class CaseViewListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.caseViewsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedCaseViews: CaseViewModel[] = [];
  selectedCaseView: SelectCaseViewDto = {};
  caseViews: CaseViewModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private caseViewsHttpService: CaseViewsHttpService,
    private uploadProjectsHttpService: UploadProjectsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Proyectos'}
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
    this.uploadProjectsHttpService.findAll(page, this.search.value).subscribe((uploadProjects) => this.caseViews = uploadProjects);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'theme', header: 'Tema del proyecto'},
      {field: 'members', header: 'Integrantes'},
      {field: 'summary', header: 'Resumen del proyecto'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      // {
      //   label: 'Editar',
      //   icon: 'pi pi-pencil',
      //   command: () => {
      //     if (this.selectedCaseView.id)
      //       this.redirectEditForm(this.selectedCaseView.id);
      //   },
      // },
      {
        label: 'Cronograma',
        icon: 'pi pi-calendar',
        command: () => {
        this.redirectTimeline()
        },
      },
    ];
  }

  paginate(caseView: any) {
    this.findAll(caseView.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/case-views', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/case-views', id]);
  }

  redirectTimelineForm() {
    this.router.navigate(['/uic/complex-timelines', 'new']);
  }

  redirectTimeline() {
    this.router.navigate(['/uic/complex-timelines']);
  }



  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.caseViewsHttpService.remove(id).subscribe((caseView) => {
            this.caseViews = this.caseViews.filter(item => item.id !== caseView.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.caseViewsHttpService.removeAll(this.selectedCaseViews).subscribe((caseViews) => {
          this.selectedCaseViews.forEach(caseViewDeleted => {
            this.caseViews = this.caseViews.filter(caseView=> caseView.id !== caseViewDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedCaseViews = [];
        });
      }
    });
  }

  selectCaseView(caseView:CaseViewModel) {
    this.selectedCaseView = caseView;
  }
}
