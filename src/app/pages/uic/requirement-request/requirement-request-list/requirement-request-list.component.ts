import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {RequirementRequestsHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { RequirementRequestModel, SelectRequirementRequestDto } from '@models/uic';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-requirement-request-list',
  templateUrl: './requirement-request-list.component.html',
  // styleUrls: ['./requirement-request-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RequirementRequestListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.requirementRequestsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedRequirementRequests: RequirementRequestModel[] = [];
  selectedRequirementRequest: SelectRequirementRequestDto = {};
  requirementRequests: RequirementRequestModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private requirementRequestsHttpService: RequirementRequestsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Solicitud de Requerimientos'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit() {
    this.findAll();
  }

  checkState(requirementRequests: RequirementRequestModel): string {
    if (requirementRequests.approved) return 'success';

    return 'danger';
  }

  findAll(page: number = 0) {
    this.requirementRequestsHttpService.findAll(page, this.search.value).subscribe((requirementRequests) => this.requirementRequests = requirementRequests);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'name', header: 'Requerimiento'},
      // {field: 'registredAt', header: 'RegisteredAt'},
      {field: 'observations', header: 'Observación'},
      {field: 'approved', header: 'Estado de los Requerimientos'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Update',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedRequirementRequest.id)
            this.redirectEditForm(this.selectedRequirementRequest.id);
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedRequirementRequest.id)
            this.remove(this.selectedRequirementRequest.id);
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/requirement-requests', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/requirement-requests', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.requirementRequestsHttpService.remove(id).subscribe((requirementRequests) => {
            this.requirementRequests = this.requirementRequests.filter(item => item.id !== requirementRequests.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.requirementRequestsHttpService.removeAll(this.selectedRequirementRequests).subscribe((requirementRequests) => {
          this.selectedRequirementRequests.forEach(requirementRequestsDeleted => {
            this.requirementRequests = this.requirementRequests.filter(requirementRequests => requirementRequests.id !== requirementRequestsDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedRequirementRequests = [];
        });
      }
    });
  }

  selectRequirementRequests(requirementRequest: RequirementRequestModel) {
    this.selectedRequirementRequest = requirementRequest;
  }
}
