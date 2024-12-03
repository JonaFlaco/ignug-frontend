import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import { RequirementsHttpService } from '@services/uic';
import { RequirementModel } from '@models/uic';
import { RequirementTypeEnum } from '@shared/enums';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
// import { Utils } from '../utils/utils';
import Swal from 'sweetalert2';
import { Utils } from '../utils/utils';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const url = 'https://yavirac.edu.ec/img/Logo%20Yavirac.png';

@Component({
  selector: 'app-approval-request-form',
  templateUrl: './approval-request-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ApprovalRequestFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  requirements: RequirementModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Generar Solicitud Aprobación Anteproyecto';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private requirementsHttpService: RequirementsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Solicitud Aprobación Anteproyecto', routerLink: ['/uic/approval-request']},
      {label: 'Solicitud'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Solicitud Aprobación Anteproyecto';
    }
  }

  logoDataUrl: string;

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
      Utils.getImageDataUrlFromLocalPath('assets/logo.png').subscribe(
          result => this.logoDataUrl = result
    )
  }


  createPdf(){

    console.log(this.dateField.value)

    const pdfDefinition: any = {
      content: [
        {image: this.logoDataUrl, alignment: 'left', lineHeight: 5, width: 90, height: 80,  margin: [40, 0]},
        { text: `Quito D.M.   ${this.dateField.value.toLocaleString()}`, fontSize: 11, alignment: 'right', bold: true, lineHeight: 3,  margin: [40, 5 ] },
        {text: `Mgs
        ${this.teacherField.value.toLocaleString()}
        COORDINADOR DE LA CARRERA DE ${this.careerField.value.toLocaleString()}
        Presente.-`, fontSize: 11, alignment: 'left', lineHeight: 1.2, margin: [40,7]},
        {text: `Después de expresarle un caluroso saludo y éxitos en sus funciones, me permito remitirle la siguiente Solicitud:
        Yo, ${this.nameField.value.toLocaleString()}, con CC: ${this.cideField.value.toLocaleString()}, estudiante de la carrera de ${this.careerField.value.toLocaleString()} y quien culminó sus estudios en el período
        lectivo ${this.periodField.value.toLocaleString()} solicito poner en consideración la aprobación de tema titulado  ${this.nameField.value.toLocaleString()} mismo que se encuentra dentro de las líneas de investigación de la carrera.
        Nota: Adjunto anteproyecto.`
        , fontSize: 10, alignment: 'justify', lineHeight: 1.2,  margin: [40, 4]},
        {text: `Por la favorable atención que se digne dar al presente, le anticipo mis sentidos
        agradecimientos.`, fontSize: 10, alignment: 'justify', lineHeight: 1.2,   margin: [40, 4]},
        {text: `Atentamente`,  fontSize: 10, alignment: 'center', bold: true, lineHeight: 3, lineWidth: 40,  margin: [40,4]},
        {text: `___________________
        ${this.nameField.value.toLocaleString()}
        ${this.cideField.value.toLocaleString()}
        ${this.emailField.value.toLocaleString()}
        ${this.cellField.value.toLocaleString()}`,  fontSize: 10, alignment: 'center', lineHeight: 1.6},
      ],
    }

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.download();
    return this.messageService.succesPdfFields;
  }


  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required]],
      cide: [null, [Validators.pattern('[0-9]+')]],
      teacher: [null, [Validators.required]],
      career: [null, [Validators.required]],
      period: [null, [Validators.required]],
      date: [null, [Validators.required]],
      cell: [null, [Validators.pattern('[0-9]+')]],
      email: [null, [Validators.required]],
      theme: [null, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.id != '') {
        this.createPdf();
      } else {
        this.createPdf();
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsPdfFields.then();
    }
  }
  back(): void {
    this.router.navigate(['./pages/auth/auth.module']);
  }

  loadRequirements(): void {
    this.requirementsHttpService.requirement(RequirementTypeEnum.MESH_STUDENT_REQUIREMENT_NAMES).subscribe((requirements) => this.requirements = requirements);
   }

  // Getters
  get idField() {
    return this.form.controls['id'];
  }

  get periodField() {
    return this.form.controls['period'];
  }

  get teacherField() {
    return this.form.controls['teacher'];
  }

 get nameField() {
  return this.form.controls['name'];
}

get dateField() {
  return this.form.controls['date'];
}

get careerField() {
  return this.form.controls['career'];
}

get emailField() {
  return this.form.controls['email'];
}

get cellField() {
  return this.form.controls['cell'];
}

get cideField() {
  return this.form.controls['cide'];
}

}

