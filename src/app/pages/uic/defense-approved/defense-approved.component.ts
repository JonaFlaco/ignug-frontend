import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import {
  ColumnModel,
  PaginatorModel,
  StudentModel,
} from '@models/core';
import { BreadcrumbService, MessageService } from '@services/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';
import { HelpService, NoteDefensesHttpService, RubricsHttpService } from '@services/uic';
import { RubricNotesHttpService } from '@services/uic/rubric-note-http.service';
import {
  RubricNoteModel,
  SelectRubricNoteDto,
} from '@models/uic/rubric-note.model';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Utils } from './utils/utils';
import {NoteDefenseModel, RubricModel, SelectNoteDefenseDto } from '@models/uic';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const url = 'https://yavirac.edu.ec/img/Logo%20Yavirac.png';
@Component({
  selector: 'app-defense-approved',
  templateUrl: './defense-approved.component.html',
})
export class DefenseApprovedComponent implements OnInit {
  id: string = '';
  bloodTypes: NoteDefenseModel[] = [];
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.helpService.loaded$;
  columns: ColumnModel[];
  pagination$ = this.rubricNotesHttpService.pagination$;
  paginator: PaginatorModel = this.helpService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedNoteDefenses: NoteDefenseModel[] = [];
  selectedNoteDefense: SelectNoteDefenseDto = {
    nameStudent: {
      id: '',
      name: '',
      note:null,
      user: null,
      career: {
        id: '',
        name: '',
        degree: '',
      },
      identification_card: 1,
    },
    score: 0,
  };
  selectedRubricNotes: RubricNoteModel[] = [];
  selectedRubricNote:SelectRubricNoteDto ={};
  noteDefenses: NoteDefenseModel[] = [];
  rubricNotes: RubricNoteModel[] = [];
  actionButtons: MenuItem[] = [];
  form: any;


  constructor(
    public authService: AuthService,
    private helpService: HelpService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private rubricNotesHttpService: RubricNotesHttpService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
  ) {
    this.breadcrumbService.setItems([{ label: 'Nota del Examén Práctico' }]);
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
     // Obtener y mostrar los registros
    this.findAll();
  }



  findAll(page: number = 0) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.rubricNotesHttpService
      .findAll(page, this.search.value)
      .subscribe((rubricNotes) => {
        this.rubricNotes = rubricNotes.filter(
          // Filtrar y procesar los registros obtenidos
          (rubricNotes) =>
          rubricNotes.note >= 70 && rubricNotes.teacher.career.id == this.id
        );
         // Calcular las notas y mostrar los resultados
        this.calculateNote();
      });
  }



  getColumns(): ColumnModel[] {
    return [
      { field: 'card', header: 'Cedúla' },
      { field: 'student', header: 'Nombre del Estudiante' },
      { field: 'note', header: 'Nota' },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

   // Seleccionar una nota de rubrica específica
  selectRubricNote(rubricNotes: RubricNoteModel) {
    this.selectedRubricNote = rubricNotes;
  }

  // Calcular las notas promedio y mostrar los resultados
  calculateNote() {
    let totalNote = 0;
    let student: StudentModel;
    let count = 0;
    for (let rubric of this.noteDefenses) {
      if (
        student &&
        rubric.nameStudent &&
        rubric.nameStudent.id != student.id
      ) {
        const divideNote = totalNote / count;
        const noteRounded = Math.round(divideNote);
        this.noteDefenses.push({
          score: noteRounded,
          nameStudent: student,
        });
        totalNote = 0;
        count = 0;
        console.log(noteRounded);
      }

      if (rubric.nameStudent) {
        student = rubric.nameStudent;
      }
      totalNote += parseFloat(rubric.score.toString());
      count++;
    }
    const divideNote = totalNote / count;
    const noteRounded = Math.round(divideNote);
     // Agregar la nota calculada final a la lista de notas
    this.noteDefenses.push({
      score: noteRounded,
      nameStudent: student,
    });
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Generar Certificado',
        icon: 'pi pi-file-pdf',
        command: () => {
          this.certificadoPdf();
        },
      },
    ];
  }


  certificadoPdf() { // Generar un certificado en formato PDF

    const pdfDefinition: any = {  // Configuración del encabezado y contenido del PDF
      header: {
        image: this.arriba,
        alignment: 'center',
        width: 600,
        height: 99,
      },
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
          text: `El Instituto Superior Tecnológico de Turismo y Patrimonio Yavirac certifica que ${this.selectedRubricNote.student.name},con cédula de ciudadanía ${this.selectedRubricNote.student.identification_card}  aprobó el examén practico con la calificación de ${this.selectedRubricNote.note}

          Cumpliendo de esta manera con el art. 64 del Reglamento de Régimen Académico como requisito de graduación de una carrera de tercer nivel técnico.




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

      ],
    };
    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
    return this.messageService.succesPdfFields;
  }
}
