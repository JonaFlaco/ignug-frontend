import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ColumnModel, PaginatorModel } from '@models/core';
import { StudentInformationsHttpService } from '@services/uic';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { MenuItem } from 'primeng/api';
import {
  SelectStudentInformationDto,
  StudentInformationModel,
} from '@models/uic';
import { AuthService } from '@services/auth';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Utils } from '../utils/utils';
import Swal from 'sweetalert2';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const url = 'https://yavirac.edu.ec/img/Logo%20Yavirac.png';

@Component({
  selector: 'app-student-information-list',
  templateUrl: './student-information-list.component.html',
  styleUrls: ['./student-information-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StudentInformationListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.studentInformationsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedStudentInformations: StudentInformationModel[] = [];
  selectedStudentInformation: SelectStudentInformationDto = {};
  studentInformations: StudentInformationModel[] = [];
  actionButtons: MenuItem[] = [];
  logoDataUrl: string;

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private studentInformationsHttpService: StudentInformationsHttpService
  ) {
    this.breadcrumbService.setItems([
      { label: 'Información Laboral del Estudiante' },
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => (this.paginator = pagination));
    this.search.valueChanges
      .pipe(debounceTime(500))
      .subscribe((_) => this.findAll());
  }

  ngOnInit() {
    this.findAll();
    Utils.getImageDataUrlFromLocalPath('assets/logo.png').subscribe(
      (result) => (this.logoDataUrl = result)
    );
  }

  createPdf() {
    console.log();

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
        Pepito Peréz
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
    pdf.open();
    return this.messageService.succesInscription;
  }

  checkState(studentInformation: StudentInformationModel): string {
    if (studentInformation) return 'danger';

    return 'success';
  }

  findAll(page: number = 0) {
    this.studentInformationsHttpService
      .findAll(page, this.search.value)
      .subscribe(
        (studentInformations) =>
          (this.studentInformations = studentInformations)
      );
  }

  getColumns(): ColumnModel[] {
    return [
      // {field: 'student', header: 'Estudiante'},
      { field: 'cedula', header: 'Cedula' },
      { field: 'name', header: 'Nombres y Apellidos' },
      { field: 'personalEmail', header: 'Correo Personal' },
      { field: 'birthDate', header: 'Fecha de nacimiento' },
      { field: 'currentLocation', header: 'Dirección actual' },
      { field: 'entryCohort', header: 'Cohorte de entrada' },
      { field: 'exitCohort', header: 'Cohorte de salida' },
      { field: 'companyWork', header: 'Empresa' },
      { field: 'companyArea', header: 'Area' },
      { field: 'companyPosition', header: 'Cargo' },
      { field: 'laborRelation', header: 'Relación Laboral' },
      { field: 'status', header: 'Estado' },
    ];
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Update',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedStudentInformation.id)
            this.redirectEditForm(this.selectedStudentInformation.id);
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedStudentInformation.id)
            this.remove(this.selectedStudentInformation.id);
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/student-informations', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/student-informations', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.studentInformationsHttpService
          .remove(id)
          .subscribe((studentInformation) => {
            this.studentInformations = this.studentInformations.filter(
              (item) => item.id !== studentInformation.id
            );
            this.paginator.totalItems--;
          });
      }
    });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.studentInformationsHttpService
          .removeAll(this.selectedStudentInformations)
          .subscribe((studentInformations) => {
            this.selectedStudentInformations.forEach(
              (studentInformationDeleted) => {
                this.studentInformations = this.studentInformations.filter(
                  (studentInformation) =>
                    studentInformation.id !== studentInformationDeleted.id
                );
                this.paginator.totalItems--;
              }
            );
            this.selectedStudentInformations = [];
          });
      }
    });
  }

  selectStudentInformation(studentInformation: StudentInformationModel) {
    this.selectedStudentInformation = studentInformation;
  }
}
