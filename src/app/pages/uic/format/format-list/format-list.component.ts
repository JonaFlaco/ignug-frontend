import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {EstudiantesHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { EstudianteModel, FormatModel, SelectEstudianteDto, SelectFormatDto } from '@models/uic';
import { AuthService } from '@services/auth';
import { FormatsHttpService } from '@services/uic/format-http.service';

@Component({
  selector: 'app-format-list',
  templateUrl: './format-list.component.html',
  // styleUrls: ['./estudiante-list.component.scss'],
})
export class FormatListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.formatsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedFormats: FormatModel[] = [];
  selectedFormat: SelectFormatDto = {};
  formats: FormatModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private formatsHttpService: FormatsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Formatos'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }



  checkState(event: FormatModel): string {
    if (event.state) return 'success';

  return 'danger';
  }

  findAll(page: number = 0) {
    this.formatsHttpService.findAll(page, this.search.value).subscribe((formats) => this.formats = formats);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'name', header: 'Nombre del documento'},
      {field: 'description', header: 'Descripción del documento'},
      {field: 'file', header: 'Archivo'},
      {field: 'state', header: 'Estado de la solicitud'},

    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedFormat.id)
            this.redirectEditForm(this.selectedFormat.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedFormat.id)
            this.remove(this.selectedFormat.id);
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/formats', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/formats', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.formatsHttpService.remove(id).subscribe((format) => {
            this.formats = this.formats.filter(item => item.id !== format.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.formatsHttpService.removeAll(this.selectedFormats).subscribe((formats) => {
          this.selectedFormats.forEach(formatDeleted => {
            this.formats = this.formats.filter(format => format.id !== formatDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedFormats = [];
        });
      }
    });
  }

  selectFormat(format: FormatModel) {
    this.selectedFormat = format;
  }
}

