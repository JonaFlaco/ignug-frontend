import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {DocumentsHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { DocumentModel, InscriptionModel, SelectDocumentDto } from '@models/uic';
import { YearModel } from '@models/core';
import { AuthService } from '@services/auth';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Utils } from '../image/image';
pdfMake.vfs = pdfFonts.pdfMake.vfs

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
})
export class DocumentListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.documentsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedDocuments: DocumentModel[] = [];
  selectedDocument: SelectDocumentDto = {};
  documents: DocumentModel[] = [];
  actionButtons: MenuItem[] = [];
  years: YearModel[] = [];
  requerimientos: InscriptionModel[] = [];
  estudiantes: InscriptionModel[] = [];
  cedulas: InscriptionModel[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private documentsHttpService: DocumentsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Documents'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();

    Utils.getImageDataUrlFromLocalPath('assets/logo.png').subscribe(
      result => this.logoDataUrl = result
      )
  }

  // checkState(document: DocumentModel): string {
  //   if (document.isEnable) return 'success';

  // return 'danger';
  // }

  findAll(page: number = 0) {
    this.documentsHttpService.findAll(page, this.search.value).subscribe((documents) => this.documents = documents);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'cedula', header: 'CEDULA'},
      {field: 'name', header: 'ESTUDIANTE'},
      {field: 'isEnable', header: 'ESTADO'},
      {field: 'observation', header: 'OBSERVACION'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Validar',
        icon: 'pi pi-check',
        command: () => {
          if (this.selectedDocument.id)
            this.redirectEditForm(this.selectedDocument.id);
        },
      },
      {
        label: 'Descargar Archivos',
        icon: 'pi pi-file-pdf',
        command: () => this.obtainFile(this.selectedDocument.id),
      },
      {
        label: 'Descarga Certificado',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedDocument.id)
            this.createPDF();
        },
      },
      // {
      //   label: 'Delete',
      //   icon: 'pi pi-trash',
      //   command: () => {
      //     if (this.selectedDocument.id)
      //       this.remove(this.selectedDocument.id);
      //   },
      // },
    ];
  }

  logoDataUrl: string;

  createPDF(){
    const pdfDefinition: any = {
      content: [
    {image: this.logoDataUrl, alignment: 'center', width: 80, height: 70,  rowSpan: 2},
		{
			text: 'Instituto Superior Tecnológico Benito Juárez',
			style: 'header',
			alignment: 'center'
		},
    {
			text: 'CERTIFICADO DE MATRICULA',
			style: 'header',
			alignment: 'center'
		},
		{
			text: [
				'Se le comunica que hora usted esta matriculado para el proceso de titulacion.\n',
				'Por lo que este documento sera valido hasta la finalizacion del su respectiva titulacion \n',
				'Muchas Gracias por su atencion.'
				],
			style: 'header',
			bold: false
		}
	],
	styles: {
		header: {
			fontSize: 12,
			bold: true,
			alignment: 'justify',
      margin: [0, 20, 0, 0]
		}
	}
    }
    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
    return this.messageService.succesFields;
  }

  obtainFile(id: string): void {
    const document = this.documents.find(
      (document) => document.id == id
    );
    const filename = `Hello.xlsx`;
    /*this.documentsHttpService.download(filename).subscribe((res) => {
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(res);
      link.download = filename;
      link.click();
    });*/
  }

  paginate(document: any) {
    this.findAll(document.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/documents', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/documents', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.documentsHttpService.remove(id).subscribe((document) => {
            this.documents = this.documents.filter(item => item.id !== document.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.documentsHttpService.removeAll(this.selectedDocuments).subscribe((documents) => {
          this.selectedDocuments.forEach(documentDeleted => {
            this.documents = this.documents.filter(document => document.id !== documentDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedDocuments = [];
        });
      }
    });
  }

  selectDocument(document: DocumentModel) {
    this.selectedDocument = document;
  }
}
