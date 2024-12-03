import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {CataloguesHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { CatalogueModel, SelectCatalogueDto } from '@models/uic';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-catalogue-list',
  templateUrl: './catalogue-list.component.html',
  styleUrls: ['./catalogue-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CatalogueListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.cataloguesHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedCatalogues: CatalogueModel[] = [];
  selectedCatalogue: SelectCatalogueDto = {};
  catalogues: CatalogueModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private cataloguesHttpService: CataloguesHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Catalogos'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit() {
    this.findAll();
  }

  checkState(catalogue: CatalogueModel): string {
    if (catalogue.state) return 'success';

    return 'danger';
  }

  findAll(page: number = 0) {
    this.cataloguesHttpService.findAll(page, this.search.value).subscribe((catalogues) => this.catalogues = catalogues);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'name', header: 'Nombre'},
      {field: 'description', header: 'Descripción'},
      {field: 'state', header: 'Estado'},
      {field: 'catalogueType', header: 'Tipo de catalogo'},

    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedCatalogue.id)
            this.redirectEditForm(this.selectedCatalogue.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedCatalogue.id)
            this.remove(this.selectedCatalogue.id);
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/catalogues', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/catalogues', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.cataloguesHttpService.remove(id).subscribe((catalogue) => {
            this.catalogues = this.catalogues.filter(item => item.id !== catalogue.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.cataloguesHttpService.removeAll(this.selectedCatalogues).subscribe((catalogues) => {
          this.selectedCatalogues.forEach(catalogueDeleted => {
            this.catalogues = this.catalogues.filter(catalogue => catalogue.id !== catalogueDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedCatalogues = [];
        });
      }
    });
  }

  selectCatalogue(catalogue: CatalogueModel) {
    this.selectedCatalogue = catalogue;
  }
}
