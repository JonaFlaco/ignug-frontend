import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {
  AbstractControl,
  Form,
  FormControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import { CatalogueModel, CreateProjectPlanDto, PlanningModel, UpdateProjectPlanDto } from '@models/uic';
import { CataloguesHttpService, PlanningsHttpService, ProjectPlansHttpService } from '@services/uic';

import { PlanningTypeEnum } from '@shared/enums/planning.enum';
import { CatalogueTypeEnum } from '@shared/enums';
import { format } from 'date-fns';
import { FileUpload } from 'primeng/fileupload';
import { AutenticationService } from 'src/app/pages/auth/authentication/services/AutenticationService.service';

@Component({
  selector: 'app-project-plan-form',
  templateUrl: './project-plan-form.component.html',

  styleUrls: ['./project-plan-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectPlanFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  states: CatalogueModel[]=[];
  plannings: PlanningModel[] = [];
  noLoadAnteproject: boolean = false;
  form: UntypedFormGroup = this.formBuilder.group({
    title:[null, [Validators.required]],
    student: ["", [Validators.required]],
    // state:[null],
    // approvedAt:[null, [Validators.required]],
    // assignedAt:[null, [Validators.required]],
    // observation:[null],
    requestFile:[null, [Validators.required]],
    proyectPlanFile:[null],
  });

  panelHeader: string = 'Enviar solicitud de Ante-Proyecto';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  public visibleObs: boolean = false;
  public idRequest: FormControl = new FormControl("");
  public nameProyectPlanFile: FormControl = new FormControl([]);
  public nameRequestFile: FormControl = new FormControl([]);
  public uploadFiles: number;
  @ViewChild('requestId') requestId: FileUpload;
  @ViewChild('projectPlanId') projectPlanId: FileUpload;
  public editForm: FormControl = new FormControl(false);
  public observationForm: FormControl = new FormControl("");

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private projectPlansHttpService: ProjectPlansHttpService,
    private planningsHttpService: PlanningsHttpService,
    private cataloguesHttpService: CataloguesHttpService,
    private iAutenticationService: AutenticationService,
  ) {
    this.visibleObs = false;
    this.editForm.setValue(true);
    this.observationForm.setValue("");
    this.idRequest = new FormControl("");
    this.nameProyectPlanFile = new FormControl([]);
    this.nameRequestFile = new FormControl([]);
    this.uploadFiles = 0;
    this.breadcrumbService.setItems([
      {label: 'Solicitud de Ante-Proyecto', routerLink: ['/uic/project-plans']},
      {label: 'Formulario'},
    ]);
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.idRequest.setValue(activatedRoute.snapshot.params['id']) ;
      this.panelHeader = 'Update ProjectPlan';
      this.visibleObs= true;
    }
    if(window.location.href.includes("uic/project-plans/ver")){
      this.editForm.setValue(false);
    }

    this.iAutenticationService.getCurrentUser().then((oUser) => {
      this.form.controls["student"].setValue(oUser.name.trim() + " " + oUser.lastname.trim())
      this.form.controls["student"].disable()
    })
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getProjectPlan();
    this.getPlanningNames();
    this. getState();
  }

  async onSubmit(): Promise<void> {
    if (this.form.valid) {
      if (this.id != '') {
        this.update(Object.assign(this.form.value,{
          proyectPlanFile: undefined,
          requestFile: undefined,
        }));
      } else {
        this.create(Object.assign(this.form.value,{
          proyectPlanFile: undefined,
          requestFile: undefined,
          studentId: (await this.iAutenticationService.getCurrentUser()).id,
          student: undefined
        }), this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields.then();
    }
  }

  back(): void {
    this.router.navigate(['/uic/project-plans']);
  }

  create(projectPlan: CreateProjectPlanDto, formValues: any): void {
    this.projectPlansHttpService.create(projectPlan).subscribe((data: any) => {
      this.idRequest.setValue(data.id);
      this.form.reset(data);
      setTimeout(() => {
        if( this.projectPlanId){
          this.projectPlanId.upload();
        }
        if(this.requestId){
          this.requestId.upload();
        }
      },100)
    });
  }

  getProjectPlan(): void {
    this.isLoadingSkeleton = true;
    this.projectPlansHttpService.findOne(this.id).subscribe((projectPlan:any) => {
      this.isLoadingSkeleton = false;
      this.observationForm.setValue(projectPlan.observation);
      this.form.patchValue(projectPlan);
      setTimeout(() => {
        this.setFilesProjectPlans(projectPlan);
      },100)

      // [new File(projectPlan.proyectPlanFile, projectPlan.nameProyectPlanFile)]

      // let requestedAt = format(new Date(projectPlan.requestedAt), 'dd/MM/yyyy');
      // console.log (requestedAt);
      // this.requestedAtField.setValue(requestedAt);

      // let answeredAt = format(new Date(projectPlan.answeredAt), 'dd/MM/yyyy');
      // console.log (answeredAt);
      // this.answeredAtField.setValue(answeredAt);
    });
  }

  async setFilesProjectPlans(projectPlan: any): Promise<any> {
    try {
      this.nameProyectPlanFile.setValue([
        {
          name: projectPlan.nameProyectPlanFile,
          lastModified: new Date(projectPlan.requestedAt).getTime(),
          webkitRelativePath: "",
          size: 0,
            type: "pdf",
            arrayBuffer: null,
            slice: null,
            stream: null,
            text: null,
        }
      ])
    } catch(oError){
      console.log(oError);
    }
    try{
      this.nameRequestFile.setValue([
        {
          name: projectPlan.nameRequestFile,
          lastModified: new Date(projectPlan.requestedAt).getTime(),
          webkitRelativePath: "",
          size: 0,
            type: "pdf",
            arrayBuffer: null,
            slice: null,
            stream: null,
            text: null,
        }
      ])
    }catch(oError){
      console.log(oError);
    }
  }

  getPlanningNames(): void {
    // this.isLoadingSkeleton = true;
    // this.planningsHttpService.planning(PlanningTypeEnum.EVENT_NAMES).subscribe((plannings) => {
    //   this.isLoadingSkeleton = false;
    //   this.plannings = plannings;
    // });
  }
  getState(): void {
    // this.isLoadingSkeleton = true;
    // this.cataloguesHttpService.catalogue(CatalogueTypeEnum.PROJECT_PLAN_STATES).subscribe((states) => {
    //   this.isLoadingSkeleton = false;
    //   this.states = states;
    // });
  }
  loadPlannings(): void {
    this.planningsHttpService.findAll().subscribe((planningId) => this.plannings = planningId);
  }

  update(projectPlan: UpdateProjectPlanDto): void {
    this.projectPlansHttpService.update(this.id, projectPlan).subscribe((projectPlan) => {
      this.form.reset(projectPlan);
      setTimeout(() => {
        this.projectPlanId.upload();
        this.requestId.upload();
      },100)
      this.back()
    });
  }

//GET


  get titleField(): AbstractControl {
    return this.form.controls['title'];
  }

  get studentField(): AbstractControl {
    return this.form.controls['student'];
  }


  // get stateField(): AbstractControl {
  //   return this.form.controls['state'];
  // }

  // get requestedAtField(): AbstractControl {
  //   return this.form.controls['requestedAt'];
  // }

  // get answeredAtField(): AbstractControl {
  //   return this.form.controls['answeredAt'];
  // }

  // get observationField(): AbstractControl {
  //   return this.form.controls['observation'];
  // }

  get requestFileField() {
    return this.form.controls['requestFile'];
  }

  onchangeRequestFile(oEvent: any){
    this.requestFileField.setValue(oEvent)
  }

  onRemoveRequestFile(oEvent: any){
    this.requestFileField.setValue(null)
  }

  get proyectPlanFileField() {
    return this.form.controls['proyectPlanFile'];
  }

  onchangeProyectPlanFile(oEvent: any){
    this.proyectPlanFileField.setValue(oEvent)
  }

  onRemoveProyectPlanFile(oEvent: any){
    this.proyectPlanFileField.setValue(null)
  }

  onUploadComplete(oEvent: any){
    this.uploadFiles++;
    if(this.uploadFiles==2 || (!this.noLoadAnteproject && this.uploadFiles== 1 )){
      this.back();
    }
  }

  }

