import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { InscriptionModel,
  SelectDocumentDto,
   CreateDocumentDto, UpdateDocumentDto } from '@models/uic';
import { YearModel } from '@models/core';
import { InscriptionsHttpService, DocumentsHttpService } from '@services/uic';
import {BreadcrumbService, CoreService, MessageService, YearsHttpService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import { CatalogueTypeEnum } from '@shared/enums';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { MenuItem } from 'primeng/api';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  years: YearModel[] = [];
  requerimientos: InscriptionModel[] = [];
  estudiantes: InscriptionModel[] = [];
  cedulas: InscriptionModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Revision de Requisitos';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  selectedDocument: SelectDocumentDto = {};
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;
  documents: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private documentsHttpService: DocumentsHttpService,
    private yearsHttpService: YearsHttpService,
    private requerimientosHttpService: InscriptionsHttpService,
    private estudiantesHttpService: InscriptionsHttpService,
    private cedulasHttpService: InscriptionsHttpService,

  ) {
    this.breadcrumbService.setItems([
      {label: 'Documents', routerLink: ['/uic/documents']},
      {label: 'Form'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Update Document';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getDocument();
    this.getYear();
    this.getRequerimiento();
    this.getEstudiante();
    this.getCedula();

  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      observation: [null,],
      year: [null],
      //requerimiento: [null],
      estudiante: [null],
      cedula: [null],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.id != '') {
        this.update(this.form.value);
      } else {
        this.create(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields.then();
    }
  }

  back(): void {
    this.router.navigate(['/uic/documents']);
  }

  create(document: CreateDocumentDto): void {
    this.documentsHttpService.create(document).subscribe(document => {
      this.form.reset(document);
      this.back();
    });
  }

  getDocument(): void {
    this.isLoadingSkeleton = true;
    this.documentsHttpService.findOne(this.id).subscribe((document) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(document);
    });
  }

  getYear(): void {
    this.isLoadingSkeleton = true;
    this.yearsHttpService.year(CatalogueTypeEnum.YEAR).subscribe((year) => {
      this.isLoadingSkeleton = false;
      this.years = year;
    });
  }

  getRequerimiento(): void {
    this.isLoadingSkeleton = true;
    this.requerimientosHttpService.inscription(CatalogueTypeEnum.INSCRIPTION).subscribe((requerimiento) => {
      this.isLoadingSkeleton = false;
      this.requerimientos = requerimiento;
    });
  }

  getEstudiante(): void {
    this.isLoadingSkeleton = true;
    this.estudiantesHttpService.inscription(CatalogueTypeEnum.INSCRIPTION).subscribe((estudiante) => {
      this.isLoadingSkeleton = false;
      this.estudiantes = estudiante;
    });
  }

  getCedula(): void {
    this.isLoadingSkeleton = true;
    this.cedulasHttpService.inscription(CatalogueTypeEnum.INSCRIPTION).subscribe((cedula) => {
      this.isLoadingSkeleton = false;
      this.cedulas = cedula;
    });
  }

  update(document:UpdateDocumentDto): void {
    this.documentsHttpService.update(this.id, document).subscribe((document) => {
      this.form.reset(document);
      this.back()
    });
  }

  obtainFile(id: string): void {
    const document = this.documents.find(
      (document: { id: string; }) => document.id == id
    );
    const filename = `Hello.xlsx`;
    this.documentsHttpService.download(filename).subscribe((res) => {
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(res);
      link.download = filename;
      link.click();
    });
  }

  logoDataUrl: string;

  createPDF(){
    const pdfDefinition: any = {
      content: [
    {image: this.logoDataUrl, alignment: 'left', width: 70, height: 60,  rowSpan: 2},
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
				'Header style in this example sets alignment to justify, so this paragraph should be rendered \n',
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
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
      margin: [0, 25, 0, 0]
		}
	}
    }
    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
    return this.messageService.succesFields;
  }

  // Getters
  get observationField() {
    return this.form.controls['observation'];
  }

  get yearField() {
    return this.form.controls['year'];
  }

  get requerimientoField() {
    return this.form.controls['requerimiento'];
  }

  get estudianteField() {
    return this.form.controls['estudiante'];
  }

  get cedulaField() {
    return this.form.controls['cedula'];
  }

}
