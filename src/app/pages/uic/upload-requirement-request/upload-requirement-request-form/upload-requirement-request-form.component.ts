import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import { ModalitiesHttpService, PlanningsHttpService, UploadRequirementRequetsHttpService } from '@services/uic';
import { CreateUploadRequirementRequestDto, RequirementModel, UploadRequirementRequestModel, UpdateUploadRequirementRequestDto, PlanningModel, ModalityModel, ReadPlanningDto } from '@models/uic';
import { ModalityTypeEnum, RequirementTypeEnum } from '@shared/enums';
import { PlanningTypeEnum } from '@shared/enums/planning.enum';
import { UploadRequirementRequestComponent } from '../upload-requirement-request.component';
import { DateValidators } from '@shared/validators';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-upload-requirement-request-form',
  templateUrl: './upload-requirement-request-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class UploadRequirementRequestFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  planning:ReadPlanningDto = {}
  bloodTypes: UploadRequirementRequestModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Subir Archivos Requeridos';
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;
  requirements: RequirementModel[];

  constructor(
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private uploadrequirementRequestsHttpService: UploadRequirementRequetsHttpService,
    private modalitiesHttpService: ModalitiesHttpService,
    private planningsHttpService: PlanningsHttpService,
  ) {
    this.breadcrumbService.setItems([
      { label: 'Cargar Archivos Requisitos Requeridos', routerLink: ['/uic/upload-requirement-requests'] },
      { label: 'Formulario' },
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
    // this.loadNameModality();
    // this.loadPlanningNames();
    this.getUploadRequirementRequest();
  }

  // get newForm(): UntypedFormGroup {
  //   return this.formBuilder.group({
  //   name: [null, [Validators.required]],
  //   cedula: [null, [Validators.pattern('[0-9]+')]],
  //   registeredAt: [null, [DateValidators.min(new Date())]],
  //   namePlanning: [null, [Validators.required]],
  //   nameModality: [null, [Validators.required]],
  //   });
  // }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.id != '') {
        this.update(this.form.value);
      } else {
        //this.create(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields.then();
    }
  }
  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      file: [null, [Validators.nullValidator]],
    });
  }

  // create(UploadRequirementRequest: CreateUploadRequirementRequestDto): void {
  //   this.uploadrequirementRequestsHttpService.create(UploadRequirementRequest).subscribe(UploadRequirementRequest => {
  //     this.form.reset(UploadRequirementRequest);
  //     this.back();
  //   });
  // }

  back(): void {
    this.router.navigate(['/uic/upload-requirement-requests']);
  }

  getUploadRequirementRequest(): void {
    this.isLoadingSkeleton = true;
    this.uploadrequirementRequestsHttpService.findOne(this.id).subscribe((uploadrequirementRequest) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(uploadrequirementRequest);
      // let date = format(new Date(tribunal.date), 'dd/MM/yyyy');
      // console.log (date);
    });
  }

  // loadPlanningNames(): void {
  //   this.planningsHttpService.findAll().subscribe((namePlannings) => this.namePlannings = namePlannings);
  // }

  // loadNameModality(): void {
  //   this.modalitiesHttpService
  //     .modality(ModalityTypeEnum.UPLOAD_NAMES)
  //     .subscribe((nameModalities) => (this.nameModality = nameModalities.filter((modalities)=>modalities.state==true)));
  // }

  update(uploadrequirementRequest: UpdateUploadRequirementRequestDto): void {
    this.uploadrequirementRequestsHttpService
    .update(this.id, uploadrequirementRequest)
    .subscribe((uploadrequirementRequest) => {
      this.form.reset(uploadrequirementRequest);
      this.back()
    });
  }

  myUploader(event: any): void {
    console.log(event);
    const body = new FormData();

    for (let file of event.files) {
      body.append('file', file);
      console.log(typeof file.name);
      this.fileField.setValue(file.name);
    }
  }

    // Getters
    get fileField() {
      return this.form.controls['file'];
    }
  }
