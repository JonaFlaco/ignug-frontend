import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import { ModalitiesHttpService, PlanningsHttpService, ReviewRequirementsHttpService } from '@services/uic';
import { CreateReviewRequirementDto, RequirementModel, ReviewRequirementModel, UpdateReviewRequirementDto, PlanningModel, ModalityModel, UploadRequirementRequestModel } from '@models/uic';
import { ModalityTypeEnum, RequirementTypeEnum } from '@shared/enums';
import { PlanningTypeEnum } from '@shared/enums/planning.enum';
import { AuthService } from '@services/auth';
import { ReviewRequirementComponent } from '../review-requirement.component';

@Component({
  selector: 'app-review-requirement-form',
  templateUrl: './review-requirement-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ReviewRequirementFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: ReviewRequirementModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Descargar Archivos Requeridos';
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private reviewRequirementsHttpService: ReviewRequirementsHttpService,
    private modalitiesHttpService: ModalitiesHttpService,
    private planningsHttpService: PlanningsHttpService,
  ) {
    this.breadcrumbService.setItems([
      { label: 'Cargar Archivos Requisitos Requeridos', routerLink: ['/uic/review-requirements'] },
      { label: 'Formulario de Observacion' },
    ]);
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar Cargar de Archivos';
    }
   }

   async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getReviewRequirement();
  }



  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
    registeredAt: [null],
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

  create(ReviewRequirement: CreateReviewRequirementDto): void {
    this.reviewRequirementsHttpService.create(ReviewRequirement).subscribe(ReviewRequirement => {
      this.form.reset(ReviewRequirement);
      this.back();
    });
  }

  back(): void {
    this.router.navigate(['/uic/review-requirements']);
  }


  getReviewRequirement(): void {
    this.isLoadingSkeleton = true;
    this.reviewRequirementsHttpService.findOne(this.id).subscribe((reviewRequirement) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(reviewRequirement);
    });
  }

  update(reviewRequirement: UpdateReviewRequirementDto): void {
    this.reviewRequirementsHttpService
    .update(this.id, reviewRequirement)
    .subscribe((reviewRequirement) => {
      this.form.reset(reviewRequirement);
      this.back()
    });
  }

  // Getters
  get idField(): AbstractControl {
    return this.form.controls['id'];
  }

  get approvedField() {
  return this.form.controls['approved'];
}

  get registeredAtField() {
  return this.form.controls['registeredAt'];
}

get observationField() {
  return this.form.controls['observation'];
}
 }
