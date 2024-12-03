import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {InscriptionsHttpService, StudentInformationsHttpService, PlanningsHttpService,} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { InscriptionModel, ModalityModel, ReadPlanningDto, SelectDocumentDto, SelectInscriptionDto, StudentInformationModel } from '@models/uic';
import { AuthService } from '@services/auth';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Utils } from '../image/image';
pdfMake.vfs = pdfFonts.pdfMake.vfs
import { StatusEnum } from '@shared/enums';


@Component({
  selector: 'app-inscription-list',
  templateUrl: './inscription-list.component.html',
  styleUrls: ['./inscription-list.component.scss'],
})
export class InscriptionListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.inscriptionsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedInscriptions: InscriptionModel[] = [];
  selectedInscription: SelectInscriptionDto = {};
  inscriptions: InscriptionModel[] = [];
  actionButtons: MenuItem[] = [];
  plannings: ModalityModel[] = [];
  students: StudentInformationModel[];
  student: StudentInformationModel[]=[];
  planning:ReadPlanningDto = {}
  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private inscriptionsHttpService: InscriptionsHttpService,
    private studentInformationsHttpService: StudentInformationsHttpService,
    private planningsHttpService: PlanningsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Lista de matriculados'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
    this.getStudents();

    Utils.getImageDataUrlFromLocalPath('assets/logo.png').subscribe(
      result => this.logoDataUrl = result
      )
  }

  checkState(inscription: StudentInformationModel): string {
    if (inscription.state) return 'success';

  return 'danger';
  }

  findAll(page: number = 0) {
    this.studentInformationsHttpService.findAll(page, this.search.value).subscribe((inscriptions) => this.student = inscriptions);
  }

  findByPlanning(page: number = 0,planningId:string = '') {
    this.inscriptionsHttpService.findByPlanning(page, this.search.value,planningId).subscribe((inscriptions) => this.inscriptions = inscriptions);
  }

  getStudents():void{
    this.studentInformationsHttpService.findAll().subscribe(students =>{
      this.students =students;
      console.log(students);
    })
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'cedula', header: 'CEDULA'},
      {field: 'name', header: 'ESTUDIANTE'},
      {field: 'status', header: 'ESTADO'},
    ]
  }



  getActionButtons(): MenuItem[] {
    return [

      {
        label: 'Revisar Documentos',
        icon: 'pi pi-search',
        command: () => {
          if (this.selectedInscription.id)
            this.redirectDocument(this.selectedInscription.id);
        },
      },
       {
        label: 'Descargar Certificado de matriculacion',
        icon: 'pi pi-download',
        command: () => {
          if (this.selectedInscription.id)
            this.createPDF();
       },
      },
      {
        label: 'Cambiar Estado',
        icon: 'pi pi-check',
        items: [
          // {
          //   label: 'Matriculado',
          //   icon: 'pi pi-check-circle',
          //   command: () => {
          //     if (this.selectedInscription.id)
          //       this.changeStatus(
          //         this.selectedInscription.id,
          //         StatusEnum.ACTIVE
          //       );
          //   },
          // },
          // {
          //   icon: 'pi pi-minus-circle',
          //   label: 'No Matriculado',
          //   command: () => {
          //     if (this.selectedInscription.id)
          //       this.changeStatus(
          //         this.selectedInscription.id,
          //         StatusEnum.INACTIVE
          //       );
          //   },
          // },
        ],
      },
      {
        label: 'Agregar Observación',
        icon: 'pi pi-check',
        command: () => {
          if (this.selectedInscription.id)
            this.redirectTutor(this.selectedInscription.id);
        },
      },
    ];
  }

  // changeStatus(id: string, statusP: StatusEnum) {
  //   this.messageService
  //     .questionApprove(`¿Está seguro de cambiar el estado a ${statusP}?`,'No se puede cambiar después')
  //     .then((result) => {
  //       if (result.isConfirmed) {
  //         const filterResult = {
  //           status: statusP,
  //         };
  //         this.studentInformationsHttpService.changeStatus(id, filterResult).subscribe(() => {
  //           //this.findActive();
  //           this.findAll();
  //         });
  //       }
  //     });
  // }

  paginate(inscription: any) {
    this.findAll(inscription.page);
  }

  //RUTAS BOTONES
  redirectCreateForm() {
    this.router.navigate(['/uic/review-requirements']);
  }

  redirectDocument(id: string) {
    this.router.navigate(['/uic/review-requirements']);
  }

  redirectTutor(id: string) {
    this.router.navigate(['/uic/inscriptions', 'new' ]);
  }


  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.inscriptionsHttpService.remove(id).subscribe((inscription) => {
            this.inscriptions = this.inscriptions.filter(item => item.id !== inscription.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.inscriptionsHttpService.removeAll(this.selectedInscriptions).subscribe((inscriptions) => {
          this.selectedInscriptions.forEach(inscriptionDeleted => {
            this.inscriptions = this.inscriptions.filter(inscription => inscription.id !== inscriptionDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedInscriptions = [];
        });
      }
    });
  }

  selectInscription(inscription: InscriptionModel) {
    this.selectedInscription = inscription;
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
      //{text: `Para: ${this.selectedInscription.studentName.name} de C.C.I: ${this.selectedInscription.studentName.cedula}`,  fontSize: 12, bold: true,},
      {
        text: [
          'Se le comunica que hora usted estudiante esta matriculado para el proceso de titulacion.\n',
          'Por lo que este documento sera valido hasta la finalizacion del su respectiva titulacion \n',
          'Muchas Gracias por su atencion.'
          ],
        style: 'header',
        bold: false
      },
      {
        text: [

          'Muchas Gracias por su atencion.'
          ],
        style: 'header',
        alignment: 'center',
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

  findActive () {
    this.planningsHttpService.findActive().subscribe(planning=>{
      this.planning=planning;
      this.findByPlanning(0, planning.id);
    })

  }

  checkStatus(condicion: string): string {
    if (condicion == StatusEnum.ACTIVE) return 'success';
    if (condicion == StatusEnum.INACTIVE) return 'danger';

    return 'warning';
  }
}
