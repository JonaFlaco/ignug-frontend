import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from "@angular/forms";
import { Router } from '@angular/router';
import { debounceTime } from "rxjs";
import { ColumnModel, PaginatorModel } from '@models/core';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { MenuItem } from "primeng/api";
import { AuthService } from '@services/auth';
import { SelectMemorandumDto, MemorandumModel } from '@models/uic';
import { MemorandumsHttpService } from '@services/uic';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Utils } from '../utils/utils';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const url = 'https://yavirac.edu.ec/img/Logo%20Yavirac.png';

@Component({
  selector: 'app-memorandum-list',
  templateUrl: './memorandum-list.component.html',
})
export class MemorandumListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.memorandumHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedMemorandums: MemorandumModel[] = [];
  selectedMemorandum: SelectMemorandumDto = {};
  memorandums: MemorandumModel[] = [];
  actionButtons: MenuItem[] = [];
  logoDataUrl: string;
  arriba: string;
  abajo: string;

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private memorandumHttpService: MemorandumsHttpService,
  ) {
    this.breadcrumbService.setItems([
      { label: 'Memorandos' }
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
    Utils.getImageDataUrlFromLocalPath('assets/arriba.png').subscribe(
      result => this.arriba = result
    )
    Utils.getImageDataUrlFromLocalPath('assets/abajo.png').subscribe(
      result => this.abajo = result
    )
  }

  findAll(page: number = 0) {
    this.memorandumHttpService.findAll(page, this.search.value).subscribe((memorandums) => this.memorandums = memorandums);
  }

  getColumns(): ColumnModel[] {
    return [
      { field: 'type', header: 'Tipo de memorando' },
      { field: 'nameTeacher', header: 'Nombre del tutor encargado' },
      { field: 'nameStudent', header: 'Nombre del estudiante aspirante' },
      { field: 'lab', header: 'Lugar del examen' },
      // {field: 'dateWritten', header: 'Fecha de redacción'},
      { field: 'dateApplication', header: 'Fecha del examen' },
      { field: 'time', header: 'Hora del examen' },

    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedMemorandum.id)
            this.redirectEditForm(this.selectedMemorandum.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedMemorandum.id)
            this.remove(this.selectedMemorandum.id);
        },
      },
      {
        label: 'Generar Memorando',
        icon: 'pi pi-file-pdf',
        command: () => {
            this.memorando();
        },
      },
    ];
  }

  splitButtonModel: MenuItem[] = [
    {
      label: 'Aplicador del examen teórico',
      icon: 'pi pi-arrow-right',
      command: () => {
        this.redirectCreateForm();
      }
    },
    {
      label: 'Tutor Caso práctico',
      icon: 'pi pi-arrow-right',
      command: () => {
        this.redirectTutor();
      }
    },
  ];

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/memorandums', 'new']);
  }
  redirectTutor() {
    this.router.navigate(['/uic/memorandums/tutor', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/memorandums', id]);
  }

  redirectHome() {
    this.router.navigate(['/uic/memorandum-home']);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.memorandumHttpService.remove(id).subscribe((memorandum) => {
            this.memorandums = this.memorandums.filter(item => item.id !== memorandum.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.memorandumHttpService.removeAll(this.selectedMemorandums).subscribe((memorandums) => {
          this.selectedMemorandums.forEach(memorandumDeleted => {
            this.memorandums = this.memorandums.filter(memorandum => memorandum.id !== memorandumDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedMemorandums = [];
        });
      }
    });
  }

  selectMemorandum(memorandum: MemorandumModel) {
    this.selectedMemorandum = memorandum;
  }

  memorando(){
    console.log()
    const pdfDefinition: any = {
      header: {image: this.arriba, alignment: 'center', width:600, height: 99},
      //footer: {image: this.abajo, alignment: 'right', width:600, height: 45},
      content: [
        {text: `



        MEMORANDO ISTY-DS-«Memo_TUTOR»-2023`,  fontSize: 12, alignment: 'center', margin: [20,30]},
        {text: `DE: Mgs.  Diego Yánez`,  fontSize: 9, bold: true,},
        {text: `COORDINADOR DE LA CARRERA DESARROLLO DE SOFWARE`,  fontSize: 9, bold: true,},
        {text: `PARA: ${this.selectedMemorandum.nameTeacher.name}`,  fontSize: 9, bold: true,},
        {text: `DOCENTE DE LA CARRERA DESARROLLO DE SOFWARE`,  fontSize: 9, bold: true,},
        {text: `ASUNTO:  DESIGNACIÓN DE APLICADOR EXAMEN TEORICO DEL COMPLEXIVO`,  fontSize: 9, bold: true},
        {text: `
        FECHA: ${this.selectedMemorandum.dateWritten}`,  fontSize: 10, alignment: 'left'},
        {text: `

        Luego de expresarle un atento y cordial saludo, me permito comunicar que ha sido designado como docente aplicador del examen teórico del complexivo de el/la estudiante ${this.selectedMemorandum.nameStudent.name} con cédula de identidad Nro ${this.selectedMemorandum.nameStudent.identification_card}, cursante de la carrera de Desarrollo de Software, el cual se aplicará el ${this.selectedMemorandum.dateApplication} a las ${this.selectedMemorandum.time} `,  fontSize: 10, alignment: 'justify'},
        {text: `
        Por la atención prestada al presente reitero mis agradecimientos.
        Atentamente`, fontSize: 10},
        {text: `



        ------------------------------`, fontSize: 10, alignment: 'center', bold: true,},
        {text: `Mgs.  Diego Yánez`, fontSize: 10, alignment: 'center'},
        {text: `COORDINADOR DE LA CARRERA DESARROLLO DE SOFWARE`, fontSize: 10, alignment: 'center', bold: true,},
        //{image: this.abajo, alignment: 'center', width:600, height: 121},
        {text: `

































        PROVEÍDO DE LAS CALIFICACIONES DE LA EVALUACIÓN TEORICO DEL EXAMEN COMPLEXIVO
        `, fontSize: 10, alignment: 'center', bold: true,},
        {text: `EL INSTITUTO SUPERIOR TECNOLÓGICO DE TURISMO Y PATRIMONIO Y YAVIRAC, CARRERA DE TECNOLOGÍA EN DESARROLLO DE SOFTWARE. -   De conformidad con lo dispuesto en el reglamento del sistema de estudios, el señor /señorita ${this.selectedMemorandum.nameStudent.name} con cédula de identidad Nro. ${this.selectedMemorandum.nameStudent.identification_card} rindió el examen teórico del complexivo y obtuvo las siguientes calificaciones:

        `, fontSize: 10, alignment: 'justify',},
        {table: {
          widths: [68,77,77,70,95,70],
          heights: [30,30,30,30,30,30],
          body: [
            ['', {text: `Aplicador`, fontSize: 10, alignment: 'center'}, {text: `CALIFICACIÓN SOBRE 100 PUNTOS`, fontSize: 10, alignment: 'center'},{text: `CALIFICACIÓN SOBRE 10 PUNTOS`, fontSize: 10, alignment: 'center'},{text: `EN LETRAS`, fontSize: 10, alignment: 'center', widths: ['auto']}, {text: `FIRMA`, fontSize: 10, alignment: 'center'}],
            [{text: `Evaluación teórica`, fontSize: 10, alignment: 'center'}, {text: `${this.selectedMemorandum.nameTeacher.name}`, fontSize: 10, alignment: 'center'}, '','', '', ''],
            [{text: `Promedio`, fontSize: 10, alignment: 'center'}, '', '','',{text: ``, colSpan: 2}, ''],
          ], alignment: 'center'
        }},
        {text: `
        Considerando las presentes calificación se procede a nombrar al Tribunal Calificador de la Defensa Oral`, fontSize: 8, alignment: 'center'},
        {text: `



        ------------------------------`, fontSize: 10, alignment: 'center', bold: true,},
        {text: `Mgs.  Diego Yánez`, fontSize: 10, alignment: 'center'},
        {text: `COORDINADOR DE LA CARRERA DESARROLLO DE SOFWARE`, fontSize: 10, alignment: 'center', bold: true,},
        {text: `EL INSTITUTO SUPERIOR TECNOLÓGICO DE TURISMO Y PATRIMONIO Y YAVIRAC`, fontSize: 10, alignment: 'center', bold: true,},
      ]
    }
    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open()
    return this.messageService.succesPdfFields;
  }
}
