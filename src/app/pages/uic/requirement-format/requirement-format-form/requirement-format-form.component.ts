import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CreateRequirementFormatDto,
  ModalityModel,
  ProfessionModel,
  RequirementFormatModel,
  UpdateRequirementFormatDto,
} from '@models/uic';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { ModalitiesHttpService, ProfessionsHttpService, RequirementFormatsHttpService } from '@services/uic';
import { CatalogueTypeEnum, ModalityTypeEnum } from '@shared/enums';
import { OnExitInterface } from '@shared/interfaces';
import { TableBody } from 'primeng/table';

@Component({
  selector: 'app-requirement-format-form',
  templateUrl: './requirement-format-form.component.html',
  styleUrls: ['./requirement-format-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RequirementFormatFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear Formato';
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;
  nameModalities: ModalityModel[] = [];
  nameCareers: ProfessionModel[] = [];
  private fileTmp: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private requirementsHttpService: RequirementFormatsHttpService,
    private modalitiesHttpService: ModalitiesHttpService,
    private professionsHttpService: ProfessionsHttpService,
    private router: Router
  ) {
    this.breadcrumbService.setItems([
      { label: 'Formatos', routerLink: ['/uic/requirement-formats'] },
      { label: 'Formulario' },
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService
        .questionOnExit()
        .then((result) => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getRequirementFormat();
    this.loadNameModality();
    this.loadNameCareer();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      nameFormat: [null, [Validators.required,Validators.minLength(5),Validators.nullValidator]],
      nameModality: [null, [Validators.required]],
      nameCareer: [null, [Validators.required]],
      filename: [null, [Validators.nullValidator]],
      requiredFormat: [false, [Validators.required]],
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

  loadNameModality(): void {
    this.modalitiesHttpService
      .modality(ModalityTypeEnum.PLANNING_NAMES)
      .subscribe((nameModalities) => (this.nameModalities = nameModalities));
  }
  loadNameCareer(): void {
    this.professionsHttpService
      .profession(CatalogueTypeEnum.PROFESSION)
      .subscribe((nameCareers) => (this.nameCareers = nameCareers));
  }


  back(): void {
    this.router.navigate(['/uic/requirement-formats']);
  }

  create(requirement: CreateRequirementFormatDto): void {
    this.requirementsHttpService
      .create(requirement)
      .subscribe((requirement) => {
        this.form.reset(requirement);
        this.back();
      });
  }

  getRequirementFormat(): void {
    this.isLoadingSkeleton = true;
    this.requirementsHttpService.findOne(this.id).subscribe((requirement) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(requirement);
    });
  }

  update(requirement: UpdateRequirementFormatDto): void {
    this.requirementsHttpService
      .update(this.id, requirement)
      .subscribe((requirement) => {
        this.form.reset(requirement);
        this.back();
      });
  }

  myUploader(event: any): void {
    console.log(event);
    const body = new FormData();

    for (let file of event.files) {
      body.append('file', file);
      console.log(typeof file.name);
      this.filenameField.setValue(file.name);
    }

    // this.requirementsHttpService.upload(body).subscribe((file) => {console.log(file);});
  }
  // Getters
  get idField() {
    return this.form.controls['id'];
  }

  get nameFormatField() {
    return this.form.controls['nameFormat'];
  }
  get nameModalityField() {
    return this.form.controls['nameModality'];
  }
  get nameCareerField() {
    return this.form.controls['nameCareer'];
  }
  get filenameField() {
    return this.form.controls['filename'];
  }
  get requiredFormatField() {
    return this.form.controls['requiredFormat'];
  }
}
