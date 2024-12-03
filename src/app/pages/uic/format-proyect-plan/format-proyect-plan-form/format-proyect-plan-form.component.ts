import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {EditorModule} from 'primeng/editor';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbService, CataloguesHttpService, CoreService, MessageService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import { MeshStudentRequirementsHttpService, RequirementsHttpService } from '@services/uic';
import { CreateMeshStudentRequirementDto, MeshStudentRequirementModel, RequirementModel, UpdateMeshStudentRequirementDto } from '@models/uic';
import { RequirementTypeEnum } from '@shared/enums';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Utils } from '../utils/utils';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const url = 'https://yavirac.edu.ec/img/Logo%20Yavirac.png';

@Component({
  selector: 'app-format-proyect-plan-form',
  templateUrl: './format-proyect-plan-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class FormatProyectPlanFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  //bloodTypes: FormatProyectPlanModel[] = [];
  requirements: RequirementModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Generar Formato de Anteproyecto';
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
    private meshStudentRequirementsHttpService: MeshStudentRequirementsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Formato de Anteproyecto', routerLink: ['/uic/format-proyect-plan']},
      {label: 'Formulario'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Update MeshStudentRequirement';
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

  anteproyectoPdf(){

    console.log(this.dateField.value)

    const pdfDefinition: any = {
      content: [
        {
          table: {
            widths: ['auto','*', 'auto'],
            body: [
              [
                {image: this.logoDataUrl, alignment: 'left', width: 70, height: 60,  rowSpan: 2},
                {text: `Instituto Superior Tecnológico Benito Juárez`, fontSize: 12, alignment: 'center',  widths: ['auto']},
                {text: `Versión
                1.0`, fontSize: 12, alignment: 'center', rowSpan: 2}
              ],
              [
                {},
                {text: `ANTE -PROYECTO DE TITULACIÓN`, fontSize: 12, alignment: 'center', bold: true},
                {},
              ],
            ],
        },
        //margin: [40, 0]
      },
      {
        table: {
          widths: [250,246],
          body: [
            [
              {text: `Propuesto por:
              ${this.nameField.value.toLocaleString()}`, fontSize: 10, alignment: 'left'},
              {text: `Carrera:
              ${this.careerField.value.toLocaleString()}`, fontSize: 10, alignment: 'left'}
            ],
            [
              {text: `Fecha:
              Quito D.M. ${this.dateField.value.toLocaleString()}`, fontSize: 12, alignment: 'left'},
              {text: ``, fontSize: 10,alignment: 'left', bold: true},
            ],
          ]
        },
        lineHeight: 1.2,margin: [0, 5]},
        {text: ``},
      {
        table: {
          widths: [505],
          body: [
            [
              {text: `1. Tema o Título del proyecto
              ${this.themeField.value.toLocaleString()}`, fontSize: 10, alignment: 'left'},

            ],
            [
              {text: `1.1 Línea de Investigación institucional :
              ${this.researchField.value.toLocaleString()}`, fontSize: 10, alignment: 'left'},
            ],
            [
              {text: `1.2 Problema de investigación:
              ${this.problemField.value.toLocaleString()}`, fontSize: 10, alignment: 'left'},
            ],
            [
              {text: `1.3 Objetivos:
                  Objetivo General:
                ${this.objectiveField.value.toLocaleString()}
                  Objetivos Específicos:
                ${this.objectiveField.value.toLocaleString()}`, fontSize: 10, alignment: 'left'},
            ],
            [
              {text: `1.4 Justificación del Proyecto :
              ${this.justificationField.value.toLocaleString()}`, fontSize: 10, alignment: 'left'},
            ],
            [
              {text: `1.5 Alcance :
              ${this.scopeemeField.value.toLocaleString()}`, fontSize: 10, alignment: 'left'},
            ],
            [
              {text: `1.6 Antecedentes de la Investigación:
              Marco Teórico.
              ${this.theoricalField.value.toLocaleString()}
              Marco Metodológico
              ${this.methodologicalField.value.toLocaleString()}`, fontSize: 10, alignment: 'left'},
            ],
            [
              {text: `1.7 Enfoque :
              Metodología
              ${this.methodologyField.value.toLocaleString()}`, fontSize: 10, alignment: 'left'},
            ],
            [
              {text: `1.8 Bibliografía:
              ${this.bibliographyField.value.toLocaleString()}`, fontSize: 10, alignment: 'left'},
            ],
            [
              {text: `1.9 Presupuesto :
              ${this.budgetField.value.toLocaleString()}`, fontSize: 10, alignment: 'left'},
            ],
          ]
        } ,lineHeight: 1.2,  margin: [0, 5]
      }
      ]
    }

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open()
    return this.messageService.succesPdfFields;
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      //Form 1
      name: [null, [Validators.required]],
      career: [null, [Validators.required]],
      date: [null, [Validators.required]],
      research: [null, [Validators.required]],
      theme: [null, [Validators.required]],
      //Form 2
      problem: [null, [Validators.required]],
      //Form 3
      objective: [null, [Validators.required]],
      objespecific: [null, [Validators.required]],
      //Form 4
      justification: [null, [Validators.required]],
      scopeeme: [null, [Validators.required]],
      //Form 5
      theorical: [null, [Validators.required]],
      methodological: [null, [Validators.required]],
      //Form 6
      methodology: [null, [Validators.required]],
      bibliography: [null, [Validators.required]],
      //Form 7
      budget: [null, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.id != '') {
        this.anteproyectoPdf();
      } else {
        this.anteproyectoPdf();
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsPdfFields.then();
    }
  }

  back(): void {
    this.router.navigate(['/uic/format-proyect-plan']);
  }

  create(meshStudentRequirement: CreateMeshStudentRequirementDto): void {
    this.meshStudentRequirementsHttpService.create(meshStudentRequirement).subscribe(meshStudentRequirement => {
      this.form.reset(meshStudentRequirement);
      this.back();
    });
  }

  loadRequirements(): void {
    this.requirementsHttpService.requirement(RequirementTypeEnum.MESH_STUDENT_REQUIREMENT_NAMES).subscribe((requirements) => this.requirements = requirements);
   }

   getMeshStudentRequirementRequirements(): void {
    this.isLoadingSkeleton = true;
    this.requirementsHttpService.requirement(RequirementTypeEnum.MESH_STUDENT_REQUIREMENT_NAMES).subscribe((requirements) => {
      this.isLoadingSkeleton = false;
      this.requirements = requirements;
    });
  }

  getMeshStudentRequirement(): void {
    this.isLoadingSkeleton = true;
    this.meshStudentRequirementsHttpService.findOne(this.id).subscribe((meshStudentRequirement) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(meshStudentRequirement);
    });
  }

  update(meshStudentRequirement: UpdateMeshStudentRequirementDto): void {
    this.meshStudentRequirementsHttpService.update(this.id, meshStudentRequirement).subscribe((meshStudentRequirement) => {
      this.form.reset(meshStudentRequirement);
      this.back()
    });
  }

  // Getters
  get idField() {
    return this.form.controls['id'];
  }

  get nameField() {
    return this.form.controls['name'];
  }

  get careerField() {
    return this.form.controls['career'];
  }

  get dateField() {
    return this.form.controls['date'];
  }

  get researchField() {
    return this.form.controls['research'];
  }

  get themeField() {
    return this.form.controls['theme'];
  }

  get problemField() {
    return this.form.controls['problem'];
  }

 get explanationField() {
  return this.form.controls['explanation'];
}

get objectiveField() {
  return this.form.controls['objective'];
}

get objespecificField() {
  return this.form.controls['objespecific'];
}

get justificationField() {
  return this.form.controls['justification'];
}

get scopeemeField() {
  return this.form.controls['scopeeme'];
}


get theoricalField() {
  return this.form.controls['theorical'];
}

get methodologicalField() {
  return this.form.controls['methodological'];
}

get methodologyField() {
  return this.form.controls['methodology'];
}

get bibliographyField() {
  return this.form.controls['bibliography'];
}

get budgetField() {
  return this.form.controls['budget'];
}

}
