import {Component, OnInit, ViewEncapsulation} from '@angular/core';
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

@Component({
  selector: 'app-mesh-student-requirement-form',
  templateUrl: './mesh-student-requirement-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MeshStudentRequirementFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: MeshStudentRequirementModel[] = [];
  requirements: RequirementModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear Malla de Requerimiento del Estudiante';
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
      {label: 'Malla de requerimiento del estudiante', routerLink: ['/uic/mesh-student-requirements']},
      {label: 'Formulario'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Update MeshStudentRequirement';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getMeshStudentRequirement();
    this.loadRequirements();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      approved: [false, [Validators.required]],
      observations: [null, [Validators.required]],
      requirement: [null],
      //meshStudent: [null, [Validators.required]],
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
    this.router.navigate(['/uic/mesh-student-requirements']);
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

  get approvedField() {
    return this.form.controls['approved'];
  }

  get observationsField() {
    return this.form.controls['observations'];
  }

  get requirementField() {
    return this.form.controls['requirement'];
 }


 //get meshStudentField() {
  //return this.form.controls['meshStudent'];
//}
}
