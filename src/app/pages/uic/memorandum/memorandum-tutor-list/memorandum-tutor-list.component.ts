import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { AuthService } from '@services/auth';
import { SelectMemorandumTutorDto, MemorandumTutorModel } from '@models/uic';
import { MemorandumTutorsHttpService } from '@services/uic';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Utils } from '../utils/utils';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const url = 'https://yavirac.edu.ec/img/Logo%20Yavirac.png';

@Component({
  selector: 'app-tutor-list',
  templateUrl: './memorandum-tutor-list.component.html',
})
export class MemorandumTutorListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.memorandumTutorHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedMemorandumTutors: MemorandumTutorModel[] = [];
  selectedMemorandumTutor: SelectMemorandumTutorDto = {};
  memorandumTutors: MemorandumTutorModel[] = [];
  actionButtons: MenuItem[] = [];
  panelHeader: string = 'Crear Memorando';
  logoDataUrl: string;
  arriba: string;
  abajo: string;

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private memorandumTutorHttpService: MemorandumTutorsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Memorandos'}
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
    this.memorandumTutorHttpService.findAll(page, this.search.value).subscribe((memorandumTutors) => this.memorandumTutors = memorandumTutors);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'type', header: 'Tipo de memorando'},
      {field: 'nameTeacher', header: 'Nombre del tutor encargado'},
      {field: 'nameStudent', header: 'Nombre del estudiante aspirante'},
      {field: 'topic', header: 'Tema del proyecto'},
      {field: 'dateWritten', header: 'Fecha de redacción'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedMemorandumTutor.id)
            this.redirectEditForm(this.selectedMemorandumTutor.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedMemorandumTutor.id)
            this.remove(this.selectedMemorandumTutor.id);
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


  paginate(event: any) {
    this.findAll(event.page);
  }

  // redirectCreateForm() {
  //   this.router.navigate(['/uic/memorandum-tutors', 'new']);
  // }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/memorandums/tutor', id]);
  }

  redirectHome() {
    this.router.navigate(['/uic/memorandum-home']);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.memorandumTutorHttpService.remove(id).subscribe((memorandumTutor) => {
            this.memorandumTutors = this.memorandumTutors.filter(item => item.id !== memorandumTutor.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.memorandumTutorHttpService.removeAll(this.selectedMemorandumTutors).subscribe((memorandumTutors) => {
          this.selectedMemorandumTutors.forEach(memorandumTutorDeleted => {
            this.memorandumTutors = this.memorandumTutors.filter(memorandumTutor => memorandumTutor.id !== memorandumTutorDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedMemorandumTutors = [];
        });
      }
    });
  }

  selectMemorandumTutor(memorandumTutor: MemorandumTutorModel) {
    this.selectedMemorandumTutor = memorandumTutor;
  }

  memorando(){
    console.log()
    const pdfDefinition: any = {
      header: {image: this.arriba, alignment: 'center', width:600, height: 99},
      //footer: {image: this.abajo, alignment: 'right', width:600, height: 45},
      content: [
        {text: `





        MEMORANDO ISTY-DS-«Memo_TUTOR»-2023`,  fontSize: 12, alignment: 'center', margin: [20,30]},
        {text: `DE: Mgs.  Diego Yánez`,  fontSize: 10, bold: true,},
        {text: `COORDINADOR DE LA CARRERA DESARROLLO DE SOFWARE`,  fontSize: 10, bold: true,},
        {text: `PARA: ${this.selectedMemorandumTutor.nameTeacher.name}`,  fontSize: 10, bold: true,},
        {text: `DOCENTE DE LA CARRERA DESARROLLO DE SOFWARE`,  fontSize: 10, bold: true,},
        {text: `ASUNTO:`,  fontSize: 10, bold: true}, {text: `DESIGNACIÓN DE TUTOR ACADÉMICO DE CASO PRACTICO COMPLEXIVO:`,  fontSize: 10},
        {text: `
        FECHA: ${this.selectedMemorandumTutor.dateWritten}`,  fontSize: 10, alignment: 'left'},
        {text: `

        Luego de expresarle un atento y cordial saludo, me permito comunicar que ha sido designado como tutor académico de el/la estudiante ${this.selectedMemorandumTutor.nameStudent.name} de C.I. ${this.selectedMemorandumTutor.nameStudent.identification_card}, cursante de la carrera de Desarrollo de Software, el cual debe realizar el seguimiento respectivo para el desarrollo el caso práctico del examen complexivo denominado ${this.selectedMemorandumTutor.topic.proyect}`,  fontSize: 10, alignment: 'justify'},
        {text: `
        Por la atención prestada al presente reitero mis agradecimientos.
        Atentamente`, fontSize: 10},
        {text: `



        ------------------------------`, fontSize: 10, alignment: 'center', bold: true,},
        {text: `Mgs.  Diego Yánez`, fontSize: 10, alignment: 'center'},
        {text: `COORDINADOR DE LA CARRERA DESARROLLO DE SOFWARE`, fontSize: 10, alignment: 'center', bold: true,},
        //{image: this.abajo, alignment: 'center', width:600, height: 121},
      ]
    }
    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open()
    return this.messageService.succesPdfFields;
  }
}
