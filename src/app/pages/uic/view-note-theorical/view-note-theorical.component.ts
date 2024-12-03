import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, throwIfEmpty } from 'rxjs';
import { ColumnModel, PaginatorModel, StudentModel } from '@models/core';
import {
  BreadcrumbService,
  MessageService,
  StudentsHttpService,
} from '@services/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';
import { EnrollmentModel, TeacherModel } from '@models/uic';
import {
  EnrollmentsHttpService,
  HelpService,
  PlanningsHttpService,
} from '@services/uic';
import { TheoricalNotesHttpService } from '@services/uic/theoretical-note-http.service';
import {
  SelectTheoricalNoteDto,
  TheoricalNoteModel,
} from '@models/uic/theoretical-note.model';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Utils } from './utils/utils';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const url = 'https://yavirac.edu.ec/img/Logo%20Yavirac.png';

@Component({
  selector: 'app-view-note-theorical',
  templateUrl: './view-note-theorical.component.html',
})
export class ViewNoteTheoricalComponent {
  id: string = '';
  bloodTypes: TheoricalNoteModel[] = [];
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.helpService.loaded$;
  checked: boolean = true;
  columns: ColumnModel[];
  //loaded$ = this.helpService.loaded$;
  pagination$ = this.enrollmentsHttpService.pagination$;
  paginator: PaginatorModel = this.helpService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedTheoricals: TheoricalNoteModel[] = [];
  selectedTheorical: TheoricalNoteModel = {
    id: '',
    name: undefined,
    note: 0,
    observations: '',
  };
  theoricals: TheoricalNoteModel[] = [];
  actionButtons: MenuItem[] = [];
  planning: string;
  prueba: TheoricalNoteModel[];
  form: any;

  constructor(
    public authService: AuthService,
    private helpService: HelpService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private enrollmentsHttpService: EnrollmentsHttpService,
    private planningsHttpService: PlanningsHttpService,
    private theoricalNotesHttpService: TheoricalNotesHttpService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.breadcrumbService.setItems([
      { label: 'Menú', routerLink: ['/uic/home-note'] },
      { label: 'Colocar Nota del Examén Teórico' },
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => (this.paginator = pagination));
    this.search.valueChanges
      .pipe(debounceTime(10))
      .subscribe((_) => this.findAll());
  }

  logoDataUrl: string;
  arriba: string;
  abajo: string;

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService
        .questionOnExit()
        .then((result) => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    Utils.getImageDataUrlFromLocalPath('assets/logo.png').subscribe(
      (result) => (this.logoDataUrl = result)
    );
    Utils.getImageDataUrlFromLocalPath('assets/arriba.png').subscribe(
      (result) => (this.arriba = result)
    );
    Utils.getImageDataUrlFromLocalPath('assets/abajo.png').subscribe(
      (result) => (this.abajo = result)
    );
    this.findAll();
    this.findActive();
  }

  findAll(page: number = 0) {
    this.theoricalNotesHttpService
      .findAll(page, this.search.value)
      .subscribe(
        (theoricals) =>
          (this.theoricals = theoricals.filter(
            (theoricals) =>
            theoricals.note >= 70 && theoricals.name.student.career.id == this.authService.auth.teacher.career.id
          ))
      );
  }

  getColumns(): ColumnModel[] {
    return [
      { field: 'identificationC', header: 'Cedúla' },
      { field: 'name', header: 'Estudiantes' },
      { field: 'note', header: 'Notas' },
    ];
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedTheorical.id)
            this.redirectEditForm(this.selectedTheorical.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedTheorical.id) this.remove(this.selectedTheorical.id);
        },
      },
      {
        label: 'Generar Certificado',
        icon: 'pi pi-file-pdf',
        command: () => {
          this.anteproyectoPdf();
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/theorical-notes', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/theorical-notes', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.theoricalNotesHttpService.remove(id).subscribe((teacher) => {
          this.theoricals = this.theoricals.filter(
            (item) => item.id !== teacher.id
          );
          this.paginator.totalItems--;
        });
      }
    });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.theoricalNotesHttpService
          .removeAll(this.selectedTheoricals)
          .subscribe((theoricals) => {
            this.selectedTheoricals.forEach((theoricalDeleted) => {
              this.theoricals = this.theoricals.filter(
                (theorical) => theorical.id !== theoricalDeleted.id
              );
              this.paginator.totalItems--;
            });
            this.selectedTheoricals = [];
          });
      }
    });
  }

  selectTheorical(theorical: TheoricalNoteModel) {
    this.selectedTheorical = theorical;
  }

  findActive() {
    this.planningsHttpService.findActive().subscribe((planning) => {
      this.planning = planning.name;
    });
  }

  anteproyectoPdf() {
    console.log(this.selectedTheorical);
    const pdfDefinition: any = {
      header: {
        image: this.arriba,
        alignment: 'center',
        width: 600,
        height: 99,
      },
      //footer: {image: this.abajo, alignment: 'right', width:600, height: 45},
      content: [
        {
          text: `





        INSTITUTO SUPERIOR TECNOLÓGICO DE TURISMO Y PATRIMONIO YAVIRAC`,
          fontSize: 13,
          alignment: 'center',
          bold: true,
        },
        {
          text: `CERTIFICADO`,
          fontSize: 16,
          decoration: 'underline',
          alignment: 'center',
          bold: true,
          margin: [20, 30],
        },
        {
          text: `El Instituto Superior Tecnológico de Turismo y Patrimonio Yavirac certifica que ${this.selectedTheorical.name.student.name},  con cédula de ciudadanía ${this.selectedTheorical.name.student.identification_card}  aprobó el examén teórico con la calificación de ${this.selectedTheorical.note}

        Cumpliendo de esta manera con el art. 64 del Reglamento de Régimen Académico, como requisito de graduación de una carrera de tercer nivel técnico.




`,
          fontSize: 12,
          alignment: 'justify',
          lineHeight: 1.3,
        },
        {
          text: '-----------------------------------------------',
          alignment: 'center',
        },
        { text: `Mgs.  Diego Yánez`, fontSize: 10, alignment: 'center' },
        {
          text: `COORDINADOR DE LA CARRERA DESARROLLO DE SOFWARE`,
          fontSize: 10,
          alignment: 'center',
          bold: true,
        },
        {
          text: `EL INSTITUTO SUPERIOR TECNOLÓGICO DE TURISMO Y PATRIMONIO Y YAVIRAC`,
          fontSize: 10,
          alignment: 'center',
          bold: true,
        },
        // {image: this.abajo, alignment: 'center', width:600, height: 121},
      ],
    };
    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
    return this.messageService.succesPdfFields;
  }
}
