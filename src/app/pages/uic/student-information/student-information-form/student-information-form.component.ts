import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbService, CoreService, MessageService, StudentsHttpService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import { StudentInformationModel, CreateStudentInformationDto, UpdateStudentInformationDto } from '@models/uic';
import { PlanningsHttpService, StudentInformationsHttpService } from '@services/uic';
import { StudentTypeEnum } from '@shared/enums/student.enum';
import { format } from 'date-fns';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import Swal from 'sweetalert2';
import { Utils } from '../utils/utils';
import { StatusEnum } from '@shared/enums';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const url = 'https://yavirac.edu.ec/img/Logo%20Yavirac.png';

@Component({
  selector: 'app-student-information-form',
  templateUrl: './student-information-form.component.html',
  styleUrls: ['./student-information-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StudentInformationFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  planning:string;
  // bloodTypes: StudentInformationModel[] = [];
  // students: StudentModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Añadir Informacion laboral del estudiante';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  logoDataUrl: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private studentInformationsHttpService: StudentInformationsHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private studentHttpService: StudentsHttpService,
    private planningsHttpService: PlanningsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Información Laboral del Estudiante', routerLink: ['/uic/student-informations']},
      {label: 'Formulario'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Update StudentInformation';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.findActive();
    //this.getStudentObservations();
    this.getstudentInformation();
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
    pdf.download();
    return this.messageService.succesInscription;
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      // student: [null],
      cedula: [null],
      name: [null, [Validators.required]],
      phone: [null],
      genre:[null],
      personalEmail:[null],
      email:[null],
      birthDate:[null],
      provinceBirth:[null],
      cantonBirth:[null],
      currentLocation:[null],
      entryCohort:[null],
      exitCohort:[null,],
      companyWork:[null],
      companyArea:[null],
      companyPosition:[null],
      laborRelation:[null],
      //status:StatusEnum,
      state:[false],
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
    this.router.navigate(['/uic/student-informations']);
  }

  create(studentInformation: CreateStudentInformationDto): void {
    this.studentInformationsHttpService.create(studentInformation).subscribe(studentInformation => {
      this.form.reset(studentInformation);
      this.createPdf();
      this.redirectRequirement();
    });
  }

  redirectRequirement() {
    this.router.navigate(['/uic/upload-requirement-requests']);
  }

  getstudentInformation(): void {
    this.isLoadingSkeleton = true;
    this.studentInformationsHttpService.findOne(this.id).subscribe((studentInformation) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(studentInformation);
      // let birthDate = format(new Date(studentInformation.birthDate), 'dd/MM/yyyy');
      // this.birthDateField.setValue(birthDate);
      let exitCohort = format(new Date(studentInformation.exitCohort), 'dd/MM/yyyy');
      this.exitCohortField.setValue(exitCohort);
    });
  }

  // getStudentObservations(): void {
  //   this.isLoadingSkeleton = true;
  //   this.studentHttpService.student(StudentTypeEnum.STUDENT_INFORMATION_OBSERVATIONS).subscribe((students) => {
  //     this.isLoadingSkeleton = false;
  //     this.students = students;
  //   });
  // }

  update(studentInformation: UpdateStudentInformationDto): void {
    this.studentInformationsHttpService.update(this.id, studentInformation).subscribe((studentInformation) => {
      this.form.reset(studentInformation);
      this.back()
    });
  }

  findActive () {
    this.planningsHttpService.findActive().subscribe(planning=>{
      this.planning = planning.name;
    })
  }


  // Getters

  // get studentField() {
  //   return this.form.controls['student'];
  // }

  get cedulaField() {
    return this.form.controls['cedula'];
  }

  get nameField() {
    return this.form.controls['name'];
  }

  get phoneField() {
    return this.form.controls['phone'];
  }

  get genreField() {
    return this.form.controls['genre'];
  }

  get personalEmailField() {
    return this.form.controls['personalEmail'];
  }

  get emailField() {
    return this.form.controls['email'];
  }

  get birthDateField() {
    return this.form.controls['birthDate'];
  }

  get provinceBirthField() {
    return this.form.controls['provinceBirth'];
  }

  get cantonBirthField() {
    return this.form.controls['cantonBirth'];
  }

  get currentLocationField() {
    return this.form.controls['currentLocation'];
  }

  get entryCohortField() {
    return this.form.controls['entryCohort'];
  }

  get exitCohortField() {
    return this.form.controls['exitCohort'];
  }
  get companyWorkField() {
    return this.form.controls['companyWork'];
  }

  get companyAreaField() {
    return this.form.controls['companyArea'];
  }

  get companyPositionField() {
    return this.form.controls['companyPosition'];
  }

  get laborRelationField() {
    return this.form.controls['laborRelation'];
  }

  get stateField() {
    return this.form.controls['state'];
  }

  // get statusField() {
  //   return this.form.controls['status'];
  // }
}
