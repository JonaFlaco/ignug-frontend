import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { AuthService } from '@services/auth';
import { DownloadFormatModel, FormatModel, SelectDownloadFormatDto, SelectFormatDto } from '@models/uic';
import { DownloadFormatsHttpService } from '@services/uic';
import { FormatsHttpService } from '@services/uic/format-http.service';

@Component({
  selector: 'app-download-format-list',
  templateUrl: './download-format-list.component.html',
  encapsulation: ViewEncapsulation.None
})
export class  DownloadFormatListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.formatsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedFormats: FormatModel[] = [];
  selectedFormat: SelectFormatDto = {};
  formats: FormatModel[] = [];
  actionButtons: MenuItem[] = [];
  downloadFormats:  DownloadFormatModel[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private formatsHttpService: FormatsHttpService,
    private downloadFormatsHttpService: DownloadFormatsHttpService,
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
    this.formatsHttpService.findAll(page, this.search.value).subscribe((formats) => this.formats = formats.filter((formats)=>formats.state==true));
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'name', header: 'Nombre del documento'},
      //{field: 'file', header: 'Archivo'},
      {field: 'description', header: 'Descripcion del documento'},
      {field: 'state', header: 'Estado del documento'},

    ]
  }

  obtainFile(id: string): void {
    const format = this.formats.find(
      (format) => format.id == id
    );
    // const filename = `SOLICITUD MODALIDAD COMPLEXIVO.docx`;
    console.log(format.file);
    this.downloadFormatsHttpService.download(format.file).subscribe((res) => {
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(res);
      link.download = format.file;
      link.click();

    });
   }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Descargar Archivo',
        icon: 'pi pi-file-pdf',
        command: () => this.obtainFile(this.selectedFormat.id),
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

