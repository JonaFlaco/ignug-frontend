import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {ModalitiesHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import {ModalityModel, SelectModalityDto } from '@models/uic';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-modality-list',
  templateUrl: './modality-list.component.html',
  styleUrls: ['./modality-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalityListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.modalitiesHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedModalities: ModalityModel[] = [];
  selectedModality: SelectModalityDto = {};
  modalities: ModalityModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private modalitiesHttpService: ModalitiesHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Modalidades'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit() {
    this.findAll();
  }

  checkState(modality: ModalityModel): string {
    if (modality.state) return 'success';

    return 'danger';
  }

  findAll(page: number = 0) {
    this.modalitiesHttpService.findAll(page, this.search.value).subscribe((modalities) => this.modalities = modalities);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'name', header: 'Nombre'},
      {field: 'description', header: 'Descripción'},
      {field: 'state', header: 'Estado'},
      //{field: 'career', header: 'Career'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedModality.id)
            this.redirectEditForm(this.selectedModality.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedModality.id)
            this.remove(this.selectedModality.id);
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/modalities', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/modalities', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.modalitiesHttpService.remove(id).subscribe((modality) => {
            this.modalities = this.modalities.filter(item => item.id !== modality.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.modalitiesHttpService.removeAll(this.selectedModalities).subscribe((modalities) => {
          this.selectedModalities.forEach(modalityDeleted => {
            this.modalities = this.modalities.filter(modality => modality.id !== modalityDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedModalities = [];
        });
      }
    });
  }

  selectModality(modality: ModalityModel) {
    this.selectedModality = modality;
  }
}
