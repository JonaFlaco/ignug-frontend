import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnModel, PaginatorModel } from '@models/core';
import {
  RequirementFormatModel,
  SelectRequirementFormatDto,
} from '@models/uic';
import { AuthService } from '@services/auth';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { RequirementFormatsHttpService } from '@services/uic';
import { MenuItem } from 'primeng/api';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-requirement-format-list',
  templateUrl: './requirement-format-list.component.html',
  styleUrls: ['./requirement-format-list.component.scss'],
})
export class RequirementFormatListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.requirementFormatsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedRequirementFormats: RequirementFormatModel[] = [];
  selectedRequirementFormat: SelectRequirementFormatDto = {};
  requirementFormats: RequirementFormatModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private requirementFormatsHttpService: RequirementFormatsHttpService
  ) {
    this.breadcrumbService.setItems([{ label: 'Formatos' }]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => (this.paginator = pagination));
    this.search.valueChanges
      .pipe(debounceTime(500))
      .subscribe((_) => this.findAll());
  }

  ngOnInit() {
    this.findAll();
  }
  
 

  findAll(page: number = 0) {
    this.requirementFormatsHttpService
      .findAll(page, this.search.value)
      .subscribe(
        (requirementFormats) => (this.requirementFormats = requirementFormats)
      );
  }

  getColumns(): ColumnModel[] {
    return [
      { field: 'nameFormat', header: 'Nombre' },
      { field: 'filename', header: 'Documento' },
      { field: 'nameCareer', header: 'Carrera' },
      { field: 'nameModality', header: 'Modalidad' },
      { field: 'requiredFormat', header: 'Requerido' },
    ];
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Update',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedRequirementFormat.id)
            this.redirectEditForm(this.selectedRequirementFormat.id);
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedRequirementFormat.id)
            this.remove(this.selectedRequirementFormat.id);
        },
      },
    ];
  }

  checkState( requerido:boolean): string {
    if (requerido) return 'danger';

    return 'success';
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/requirement-formats', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/requirement-formats', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.requirementFormatsHttpService
          .remove(id)
          .subscribe((requirementFormats) => {
            this.requirementFormats = this.requirementFormats.filter(
              (item) => item.id !== requirementFormats.id
            );
            this.paginator.totalItems--;
          });
      }
    });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.requirementFormatsHttpService
          .removeAll(this.selectedRequirementFormats)
          .subscribe((requirementFormats) => {
            this.selectedRequirementFormats.forEach(
              (requirementFormatDeleted) => {
                this.requirementFormats = this.requirementFormats.filter(
                  (requirementFormat) =>
                    requirementFormat.id !== requirementFormatDeleted.id
                );
                this.paginator.totalItems--;
              }
            );
            this.selectedRequirementFormats = [];
          });
      }
    });
  }

  selectRequirementFormat(requirementFormat: RequirementFormatModel) {
    this.selectedRequirementFormat = requirementFormat;
  }
}
