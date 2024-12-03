import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { OnExitInterface } from '@shared/interfaces';
import {
  UploadProjectsHttpService,
} from '@services/uic';
import { CatalogueTypeEnum} from '@shared/enums';
import { CareersHttpService } from '../../../../services/core/careers-http.service';
import { CareerModel } from '@models/core';
import { CreateUploadProjectDto, UploadProjectModel, UpdateUploadProjectDto } from '@models/uic';


@Component({
  selector: 'app-upload-project-form',
  templateUrl: './upload-project-form.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class UploadProjectFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: UploadProjectModel[] = [];
  careers: CareerModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Informacion general del proyecto ';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;


  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private careersHttpService: CareersHttpService,
    private uploadProjectsHttpService: UploadProjectsHttpService,
  ) {
    this.breadcrumbService.setItems([
      { label: 'Informacion general del proyecto ', routerLink: ['/uic/upload-projects'] },
      { label: 'Formulario' },
    ]);
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar Informacion';
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
    this.getCarrer();
    this.getUploadProject();

  }

//  -----------------
anteproyectoPdf(){
  const pdfDefinition: any = {
    content: [
    {
      table: {
        widths: [505],
        body: [
          [
            {text: `
            ${this.themeField.value.toLocaleString()}`, fontSize: 10, alignment: 'left'},
          ],
          [
            {text: `
            ${this.summaryField.value.toLocaleString()}`, fontSize: 10, alignment: 'left'},
          ],
          [
            {text: `
            ${this.membersField.value.toLocaleString()}`, fontSize: 10, alignment: 'left'},
          ],
          [
            {text: `
            ${this.nameCareerField.value.toLocaleString()}`, fontSize: 10, alignment: 'left'},
          ],
        ]
      } ,lineHeight: 1.2,  margin: [0, 5]
    }
    ]
  }
}
// ----------------
  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      theme: [null, [Validators.required]],
      members: [null, [Validators.required]],
      summary: [null, [Validators.required]],
      nameCareer: [null, [Validators.required]],


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
    this.router.navigate(['/uic/upload-projects']);
  }

  create(uploadProject: CreateUploadProjectDto): void {
    this.uploadProjectsHttpService.create(uploadProject).subscribe((uploadProject) => {
      this.form.reset(uploadProject);
      this.back();
    });
  }

  getUploadProject(): void {
    this.isLoadingSkeleton = true;
    this.uploadProjectsHttpService.findOne(this.id).subscribe((uploadProject) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(uploadProject);
    });
  }


  getCarrer(): void {
       this.isLoadingSkeleton = true;
       this.careersHttpService.career(CatalogueTypeEnum.CAREER).subscribe((careers) => {
         this.isLoadingSkeleton = false;
         this.careers = careers;
       });
     }


  update(uploadProject: UpdateUploadProjectDto): void {
    this.uploadProjectsHttpService
      .update(this.id, uploadProject)
      .subscribe((uploadProject) => {
        this.form.reset(uploadProject);
        this.back();
      });
  }

  // Getters
  get idField() {
    return this.form.controls['id'];
  }

  get  themeField() {
    return this.form.controls[' theme'];
  }

  get membersField() {
    return this.form.controls['members'];
  }

  get summaryField() {
    return this.form.controls['summary'];
  }

  get nameCareerField() {
    return this.form.controls['nameCareer'];
  }

}
