import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { CreateStudentDegreeDto, StudentDegreeModel, UpdateStudentDegreeDto } from '@models/uic/student-degree.model';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import { StudentsDegreeHttpService } from '@services/uic/student-degree-http.service';
import {OnExitInterface} from '@shared/interfaces';
import { PlanningModel, ModalityModel, EstudianteModel } from '@models/uic';
import { PlanningsHttpService, ModalitiesHttpService, EstudiantesHttpService } from '@services/uic';
import { ModalityTypeEnum } from '@shared/enums';
import { PlanningTypeEnum } from '@shared/enums/planning.enum';
//import { EstudianteTypeEnum } from '@shared/enums';

@Component({
  selector: 'app-student-degree-form',
  templateUrl: './student-degree-form.component.html',
  styleUrls: ['./student-degree-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StudentDegreeFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: StudentDegreeModel[] = [];
  //plannings: PlanningModel[] = [];
  //modalities: ModalityModel[] = [];
  nameModalities: ModalityModel[] = [];
  namePlannings: PlanningModel[] = [];
  nameEstudiantes: EstudianteModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Formulario-Solicitud de Inscripción';
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private studentsDegreeHttpService: StudentsDegreeHttpService,
    private planningsHttpService: PlanningsHttpService,
    private modalitiesHttpService: ModalitiesHttpService,
    private estudiantesHttpService: EstudiantesHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Solicitud de Inscripción', routerLink: ['/uic/students-degree']},
      {label: 'Formulario'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar student-degree';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    //this.loadPlannings();
    //this.loadModalities();
    this.loadNameModality();
    this.getStudentDegree();
    this.loadNamePlanning();
    this.loadNameEstudiante();

  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      //modalities: [null],
      nameModality: [null, [Validators.required]],
      namePlanning: [null, [Validators.required]],
      nameEstudiante: [null, [Validators.required]],
      //plannings: [null],
      //observation: [null, [Validators.required]],
      title:  [null, [Validators.required]],
      state:  [false, [Validators.required]],
      requerimientos: [null, [Validators.required]],
      observation: [null, [Validators.required]],
      file:  [null, [Validators.required]],
      type_request: "",
      url: "",
      dni: "",
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
    this.router.navigate(['/uic/students-degree']);
  }

  create(studentDegree: CreateStudentDegreeDto): void {
    this.studentsDegreeHttpService.create(studentDegree).subscribe(studentDegree => {
      this.form.reset(studentDegree);
      this.back();
    });
  }

  getStudentDegree(): void {
    this.isLoadingSkeleton = true;
    this.studentsDegreeHttpService.findOne(this.id).subscribe((studentDegree) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(studentDegree);
    });
  }

  update(studentDegree:UpdateStudentDegreeDto): void {
    this.studentsDegreeHttpService.update(this.id, studentDegree).subscribe((studentDegree) => {
      this.form.reset(studentDegree);
      this.back()
    });
  }

  //loadPlannings(): void {
    //this.planningsHttpService.findAll().subscribe((plannings) => this.plannings = plannings);
  //}

  //loadModalities(): void {
    //this.modalitiesHttpService.findAll().subscribe((modalities) => this.modalities = modalities);
  //}

  loadNameModality(): void {
    this.modalitiesHttpService.modality(ModalityTypeEnum.PLANNING_NAMES).subscribe((nameModalities) => this.nameModalities = nameModalities);
 }

 loadNamePlanning(): void {
  this.planningsHttpService.planning(PlanningTypeEnum.PLANNING_NAMES).subscribe((namePlannings) => this.namePlannings = namePlannings);
}

loadNameEstudiante(): void {
  this.estudiantesHttpService.findAll().subscribe((name) => this.nameEstudiantes = name);
}


  // Getters
  //get planningsField() {
    //return this.form.controls['plannings'];
  //}

  get nameModalityField() {
    return this.form.controls['nameModality'];
  }

  get namePlanningField() {
    return this.form.controls['namePlanning'];
  }

  get nameEstudianteField() {
    return this.form.controls['nameEstudiante'];
  }

  //get modalitiesField() {
    //return this.form.controls['modalities'];
  //}

  //get observationsField(): AbstractControl {
    //return this.form.controls['observation'];
  //}

  get titleField(): AbstractControl {
    return this.form.controls['title'];
  }

  get observationField(): AbstractControl {
    return this.form.controls['title'];
  }

  get requerimientosField(): AbstractControl {
    return this.form.controls['requerimientos'];
  }

  get stateField() {
    return this.form.controls['state'];
  }

  get fileField(): AbstractControl {
    return this.form.controls['file'];
  }

}
