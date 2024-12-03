import {Component, OnInit} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {PreparationCoursesHttpService, SignaturesHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { SignatureModel, SelectSignatureDto, ReadPreparationCourseDto } from '@models/uic';
import { AuthService } from '@services/auth';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import pdfMake from 'pdfmake/build/pdfmake';
import { Utils } from '../utils/utils';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const url = 'https://yavirac.edu.ec/img/Logo%20Yavirac.png';
@Component({
  selector: 'app-signature-list',
  templateUrl: './signature-list.component.html',
})
export class SignatureListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  preparationCourse: ReadPreparationCourseDto={};
  pagination$ = this.signaturesHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedSignatures: SignatureModel[] = [];
  selectedSignature: SelectSignatureDto = {};
  signatures: SignatureModel[] = [];
  actionButtons: MenuItem[] = [];
  logoDataUrl: string;


  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private signaturesHttpService: SignaturesHttpService,
    private preparationCoursesHttpService: PreparationCoursesHttpService,
    private route: ActivatedRoute,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Cursos', routerLink: ['/uic/preparation-courses']},
      {label: 'Añadir Asignaturas'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.preparationCourse = preparationCoursesHttpService.preparationCourses
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    const preparationCourseId = this.route.snapshot.paramMap.get('preparationCourseId');
    this.findByPreparationCourse(0,preparationCourseId);
    Utils.getImageDataUrlFromLocalPath('assets/logo.png').subscribe(
      (result) => (this.logoDataUrl = result)
    );
  }


  findAll(page: number = 0) {
    this.signaturesHttpService.findAll(page, this.search.value).subscribe((signatures) => this.signatures = signatures);
  }

  findByPreparationCourse(page: number = 0,preparationCourseId:string = '') {
    this.signaturesHttpService.findByPreparationCourse(page, this.search.value,preparationCourseId).subscribe((signatures) => this.signatures = signatures);
  }

  getColumns(): ColumnModel[] {
    return [
    {field: 'signature', header: 'Asignatura'},
    {field: 'hours', header: 'Numero de horas'},
    {field: 'tutor', header: 'Tutor'},
    {field: 'startDate', header: 'Fecha de inicio'},
    {field: 'endDate', header: 'Fecha de fin'},
    {field: 'preparationCourse', header: 'Curso'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedSignature.id)
            this.redirectEditForm(this.selectedSignature.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedSignature.id)
            this.remove(this.selectedSignature.id);
        },
      },
      {
        label: 'Descargar',
        icon: 'pi pi-download',
        command: () => {
          if (this.selectedSignature.id)
            this.createPdf();
        },
      },
    ];
  }

  createPdf() {
    const pdfDefinition: any = {
      content: [
        {
          image: this.logoDataUrl,
          width: 95,
          height: 85,
          alignment: 'center',
          lineHeight: 7,
        },
        {
          text: `Instituto Tecnológico de Turismo y Patrimonia Yavirac`,
          fontSize: 13,
          alignment: 'center',
          margin: [25, 15],
          lineHeight: 1.2,
          bold: true,
        },
        {
          text: `COORDINADOR UIC`,
          fontSize: 10,
          alignment: 'left',
          lineHeight: 1.2,
          margin: [40, 7],
        },
        {
          text: `Después de expresarle un caluroso saludo y éxitos en sus funciones, me permito remitirle la siguiente Solicitud:
        Yo, Pepito Peréz con CC: 1726236324, quien culminó sus estudios en el período lectivo  2022-2
        solicito poner en consideración la aprobación de mi solicitud de inscripción.`,
          fontSize: 10,
          alignment: 'justify',
          lineHeight: 1.2,
          margin: [40, 7],
        },
        {
          text: `Por la favorable atención que se digne dar al presente, le anticipo mis sentidos agradecimientos.`,
          fontSize: 10,
          alignment: 'justify',
          lineHeight: 4,
          margin: [40, 4],
        },
        {
          text: `Atentamente`,
          fontSize: 10,
          alignment: 'center',
          bold: true,
          lineHeight: 3,
          lineWidth: 40,
          margin: [40, 8],
        },
        {
          text: `___________________
        Pepito Ramirez
        17242352678
        ppp.perez@yavirac.edu.ec
        0984356757`,
          fontSize: 10,
          alignment: 'center',
          lineHeight: 1.6,
        },
      ],
    };

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.download();
    return this.messageService.succesMemoSignature;
  }


  paginate(signature: any) {
    this.findAll(signature.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/signatures', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/signatures', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.signaturesHttpService.remove(id).subscribe((signature) => {
            this.signatures = this.signatures.filter(item => item.id !== signature.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.signaturesHttpService.removeAll(this.selectedSignatures).subscribe((signatures) => {
          this.selectedSignatures.forEach(signatureDeleted => {
            this.signatures = this.signatures.filter(signature => signature.id !== signatureDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedSignatures = [];
        });
      }
    });
  }

  selectSignature(signature: SignatureModel) {
    this.selectedSignature = signature;
  }
}
