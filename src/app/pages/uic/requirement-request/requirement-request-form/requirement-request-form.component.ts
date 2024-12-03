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
import { RequirementRequestsHttpService, RequirementsHttpService } from '@services/uic';
import { CreateRequirementRequestDto, RequirementModel, RequirementRequestModel, UpdateRequirementRequestDto } from '@models/uic';
import { RequirementTypeEnum } from '@shared/enums';
@Component({
  selector: 'app-requirement-request-form',
  templateUrl: './requirement-request-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class RequirementRequestFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: RequirementRequestModel[] = [];
  names: RequirementModel[] = [];
  // meshStudent: MeshStudentRequirementModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear Solicitud de Requerimiento';
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
    private requirementRequestsHttpService: RequirementRequestsHttpService,
    private requirementsHttpService: RequirementsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Solicitud de Requerimientos', routerLink: ['/uic/requirement-requests']},
      {label: 'Formulario'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Guardar Solicitud';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getRequirementRequestNames();
    this.getRequirementRequest();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      observations: [null, [Validators.required]],
      approved: [false, [Validators.required]],
      name: [null, [Validators.required ]],
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
    this.router.navigate(['/uic/requirement-requests']);
  }

  create(requirementRequest: CreateRequirementRequestDto): void {
    this.requirementRequestsHttpService.create(requirementRequest).subscribe(requirementRequest => {
      this.form.reset(requirementRequest);
      this.back();
    });
  }

  // loadRequirements(): void {
  //  this.requirementsHttpService.findAll().subscribe((requirements) => this.requirements = requirements);
  // }

  getRequirementRequest(): void {
    this.isLoadingSkeleton = true;
    this.requirementRequestsHttpService.findOne(this.id).subscribe((requirementRequest) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(requirementRequest);
    });
  }

  getRequirementRequestNames(): void {
    this.isLoadingSkeleton = true;
    this.requirementsHttpService.requirement(RequirementTypeEnum.REQUIREMENT_REQUEST_NAMES).subscribe((names) => {
      this.isLoadingSkeleton = false;
      this.names = names;
    });
  }

  update(requirementRequest: UpdateRequirementRequestDto): void {
    this.requirementRequestsHttpService.update(this.id, requirementRequest).subscribe((requirementRequest) => {
      this.form.reset(requirementRequest);
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

  get approvedField() {
    return this.form.controls['approved'];
  }

  get observationsField() {
    return this.form.controls['observations'];
  }


}
