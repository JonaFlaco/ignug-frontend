import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { AuthService } from '@services/auth';
import { ItemModel, SelectItemDto } from '@models/uic';
import {ItemsHttpService } from '@services/uic';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
})
export class ItemListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.itemsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedItems: ItemModel[] = [];
  selectedItem: SelectItemDto = {};
  items: ItemModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private itemsHttpService: ItemsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Item Rubrica'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }

  checkState(item: ItemModel): string {
    if (item.state) return 'success';
    return 'danger';
  }


  findAll(page: number = 0) {
    this.itemsHttpService.findAll(page, this.search.value).subscribe((items) => this.items = items);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'career', header: 'Carreras'},
      {field: 'name', header: 'Items'},
      {field: 'state', header: 'Estado'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedItem.id)
            this.redirectEditForm(this.selectedItem.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedItem.id)
            this.remove(this.selectedItem.id);
        },
      },
    ];
  }

  paginate(dinamic: any) {
    this.findAll(dinamic.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/items', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/items', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.itemsHttpService.remove(id).subscribe((item) => {
            this.items = this.items.filter(item => item.id !== item.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.itemsHttpService.removeAll(this.selectedItems).subscribe((items) => {
          this.selectedItems.forEach(itemDeleted => {
            this.items = this.items.filter(item => item.id !== itemDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedItems = [];
        });
      }
    });
  }

  selectItem(item: ItemModel) {
    this.selectedItem = item;
  }
}
