import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {CatalogueTypesHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { CatalogueTypeModel, SelectCatalogueTypeDto } from '@models/uic';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-catalogue-type-list',
  templateUrl: './catalogue-type-list.component.html',
})
export class CatalogueTypeListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.catalogueTypesHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedCatalogueTypes: CatalogueTypeModel[] = [];
  selectedCatalogueType: SelectCatalogueTypeDto = {};
  catalogueTypes: CatalogueTypeModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private catalogueTypesHttpService: CatalogueTypesHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Tipo de Catalogo'}
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
    this.catalogueTypesHttpService.findAll(page, this.search.value).subscribe((catalogueTypes) => this.catalogueTypes = catalogueTypes);
  }

  getColumns(): ColumnModel[] {
    return [

      {field: 'name', header: 'Nombre'},
      {field: 'code', header: 'Código'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedCatalogueType.id)
            this.redirectEditForm(this.selectedCatalogueType.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedCatalogueType.id)
            this.remove(this.selectedCatalogueType.id);
        },
      },
    ];
  }

  paginate(catalogueType: any) {
    this.findAll(catalogueType.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/catalogueTypes', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/catalogueTypes', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.catalogueTypesHttpService.remove(id).subscribe((catalogueType) => {
            this.catalogueTypes = this.catalogueTypes.filter(item => item.id !== catalogueType.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.catalogueTypesHttpService.removeAll(this.selectedCatalogueTypes).subscribe((catalogueTypes) => {
          this.selectedCatalogueTypes.forEach(catalogueTypeDeleted => {
            this.catalogueTypes = this.catalogueTypes.filter(catalogueType => catalogueType.id !== catalogueTypeDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedCatalogueTypes = [];
        });
      }
    });
  }

  selectCatalogueType(catalogueType: CatalogueTypeModel) {
    this.selectedCatalogueType = catalogueType;
  }
}
