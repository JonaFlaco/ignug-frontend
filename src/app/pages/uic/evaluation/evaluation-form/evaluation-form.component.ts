import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import { ModalitiesHttpService, PlanningsHttpService, EvaluationHttpService, EstudiantesHttpService } from '@services/uic';
import { CreateEvaluationDto, RequirementModel, AttendanceRecordModel, UpdateEvaluationDto, PlanningModel, ModalityModel, ReadPlanningDto, EstudianteModel } from '@models/uic';
import { CatalogueTypeEnum, ModalityTypeEnum, RequirementTypeEnum } from '@shared/enums';
import { PlanningTypeEnum } from '@shared/enums/planning.enum';
import {EvaluationComponent } from '../evaluation.component';
import { DateValidators } from '@shared/validators';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-evaluation-form',
  templateUrl: './evaluation-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class EvaluationFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  planning:ReadPlanningDto = {}
  bloodTypes: AttendanceRecordModel[] = [];
  students:EstudianteModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Evaluación Continúa';
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;
  requirements: RequirementModel[];
  //value: number = 50;

  constructor(
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private evaluationHttpService: EvaluationHttpService,
    private estudiantesHttpService: EstudiantesHttpService,
    private planningsHttpService: PlanningsHttpService,
  ) {
    this.breadcrumbService.setItems([
      { label: 'Evaluación Continúa', routerLink: ['/uic/evaluation'] },
      { label: 'Evaluación' },
    ]);
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Evaluación Continúa';
    }
   }

   async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getStudents();
    //this.getEvaluation();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
    student: [null, [Validators.required]],
    note: [null,],
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

  create(evaluation: CreateEvaluationDto): void {
    this.evaluationHttpService.create(evaluation).subscribe(evaluation => {
      this.form.reset(evaluation);
      this.back();
    });
  }

  back(): void {
    this.router.navigate(['/uic/evaluation-students']);
  }

  getEvaluation(): void {
    this.isLoadingSkeleton = true;
    this.evaluationHttpService.findOne(this.id).subscribe((evaluation) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(evaluation);
    });
  }

  getStudents(): void {
    this.isLoadingSkeleton = true;
    this.estudiantesHttpService.estudiante(CatalogueTypeEnum.ESTUDIANTE).subscribe((students) => {
      this.isLoadingSkeleton = false;
      this.students = students;
    });
  }

  update(evaluation: UpdateEvaluationDto): void {
    this.evaluationHttpService
    .update(this.id, evaluation)
    .subscribe((evaluation) => {
      this.form.reset(evaluation);
      this.back()
    });
  }

  // Getters
  get idField() {
    return this.form.controls['id'];
  }

  get studentField() {
    return this.form.controls['student'];
  }

  get noteField() {
    return this.form.controls['note'];
  }
 }
