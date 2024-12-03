import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService, CoreService, MessageService, StudentsHttpService, TeachersHttpService } from '@services/core';
import { OnExitInterface } from '@shared/interfaces';
import { CatalogueModel, CreateResponseProjectPlanDto, PlanningModel, UpdateProjectPlanDto, UpdateResponseProjectPlanDto } from '@models/uic';
import { CataloguesHttpService, PlanningsHttpService, ProjectPlansHttpService, ResponseProjectPlansHttpService } from '@services/uic';
import { FileUpload } from 'primeng/fileupload';
import {MatSnackBar} from '@angular/material/snack-bar';
import { CatalogueTypeEnum } from '@shared/enums';
import { UsersHttpService } from '@services/auth';
import { StudentTypeEnum } from '@shared/enums/student.enum';
import { StudentModel, TeacherModel } from '@models/core';


@Component({
  selector: 'app-response-project-plan-form',
  templateUrl: './response-request-project-plan-form.component.html',
})
export class ResponseRequestProjectPlanFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  states: CatalogueModel[] = [];
  plannings: PlanningModel[] = [];
  students: StudentModel[] = [];
  tutors: TeacherModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Respuesta a la solicitud de anteproyecto';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  public observationForm: FormControl = new FormControl("");
  public editForm: FormControl = new FormControl(false);
  @ViewChild('requestId') requestId: FileUpload;
  @ViewChild('projectPlanId') projectPlanId: FileUpload;
  public idRequest: FormControl = new FormControl("");
  public uploadFiles: number;
  public nameProyectPlanFile: FormControl = new FormControl([]);
  public nameRequestFile: FormControl = new FormControl([]);
  catalogues:CatalogueModel[];
  filteredOptions: CatalogueModel[];

  constructor(
    private _snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private studentsHttpService: StudentsHttpService,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private responseProjectPlansHttpService: ResponseProjectPlansHttpService,
    private planningsHttpService: PlanningsHttpService,
    private cataloguesHttpService: CataloguesHttpService,
    private projectPlansHttpService: ProjectPlansHttpService,
    private teachersHttpService: TeachersHttpService,
    private iUserHttpService: UsersHttpService,
  ) {
    setTimeout(() => {
      console.log(this.tutorField.value)
    }, 5000)
    this.breadcrumbService.setItems([
      { label: 'Respuestas de solicitud', routerLink: ['/uic/response-request-project-plans'] },
      { label: 'Formulario' },

    ]);
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Responder Solicitud';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getProjectPlan();
    this.getState();
    this.getStudents();
    this.getTeachers();
    this.cataloguesHttpService.findAll().subscribe((data) => {
      this.catalogues = data;
      this.filterOptions();
    });
  }


  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      title: [null],
      tutor: [null],
      student: [null],
      state: [null],
      observation: [null],
      requestFile: [null],
      proyectPlanFile: [null],
    });
  }

  onSubmit(): void {
    if (!this.form.value.tutor){
      this._snackBar.open('Seleccione un Tutor','cerrar');
      return;
    }
    let dataUpdate = {
      observation: "",
      tutorId: this.form.value.tutor.id as string,
      studentSelectId: this.form.value.student ? this.form.value.student.id as string : null,
      title: this.form.value.title as string,
      answeredAt: new Date(),
      state: "Revisado"
    };

    if (this.form.valid) {
      if (this.id != '') {
        this.update(dataUpdate);
      } else {
        this.create(dataUpdate);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields.then();
    }
  }

  back(): void {
    this.router.navigate(['/uic/response-request-project-plans']);
  }

  create(responseProjectPlan: CreateResponseProjectPlanDto): void {
    this.responseProjectPlansHttpService.create(responseProjectPlan).subscribe(responseProjectPlan => {
      this.form.reset(responseProjectPlan);
      this.back();
    });
  }

  filterOptions(): void {
    this.filteredOptions = this.catalogues.filter((option) => {
      return option.catalogueType.name === "ESTADOS";
    });
  }

  getStudents(): void {
    this.isLoadingSkeleton = true;
    this.studentsHttpService.student(StudentTypeEnum.STUDENT).subscribe((students) => {
      this.isLoadingSkeleton = false;
      this.students = students
    });
  }

   getTeachers(): void {
    this.teachersHttpService.findAll().subscribe((tutors) => this.tutors = tutors);
  }


  getProjectPlan(): void {
    this.isLoadingSkeleton = true;
    this.projectPlansHttpService.findOne(this.id).subscribe((projectPlan: any) => {
      this.isLoadingSkeleton = false;
      this.observationForm.setValue(projectPlan.observation);
      this.form.patchValue(projectPlan);
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
    } catch (oError) {
      console.log(oError);
    }
    try {
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
    } catch (oError) {
      console.log(oError);
    }
  }

  getState(): void {
    this.isLoadingSkeleton = true;
    this.cataloguesHttpService.catalogue(CatalogueTypeEnum.PROJECT_PLAN_STATES).subscribe((states) => {
      this.isLoadingSkeleton = false;
      this.states = states;
    });
  }
  loadPlannings(): void {
    this.planningsHttpService.findAll().subscribe((planningId) => this.plannings = planningId);
  }

  update(responseProjectPlan: UpdateProjectPlanDto): void {
    this.projectPlansHttpService.update(this.id, responseProjectPlan).subscribe((responseProjectPlan) => {
      this.form.reset(responseProjectPlan);
      this.back()
    });
  }

  downloadFileAnteProyect() {
    window.open("http://localhost:3000/api/v1/ProjectPlans/downloadFileAnteProyect/" + this.id)

  }

  downloadFileRequest() {
    window.open("http://localhost:3000/api/v1/ProjectPlans/downloadFileRequest/" + this.id)

  }

  //GET

  get titleField(): AbstractControl {
    return this.form.controls['title'];
  }

  get observationField(): AbstractControl {
    return this.form.controls['observation'];
  }

  get tutorField(): AbstractControl {
    return this.form.controls['tutor'];
  }

  get studentField(): AbstractControl {
    return this.form.controls['student'];
  }

  get studentRequestField(): AbstractControl {
    return this.form.controls['studentRequest'];
  }

  get stateField(): AbstractControl {
    return this.form.controls['state'];
  }

  get requestFileField() {
    return this.form.controls['requestFile'];
  }

  get proyectPlanFileField() {
    return this.form.controls['proyectPlanFile'];
  }

  onchangeRequestFile(oEvent: any) {
    console.log(oEvent);
    this.requestFileField.setValue(oEvent)
  }

  onRemoveRequestFile(oEvent: any) {
    this.requestFileField.setValue(null)
  }

  onchangeProyectPlanFile(oEvent: any) {
    this.proyectPlanFileField.setValue(oEvent)
  }

  onRemoveProyectPlanFile(oEvent: any) {
    this.proyectPlanFileField.setValue(null)
  }

  onUploadComplete(oEvent: any) {
    this.uploadFiles++;
    if (this.uploadFiles = 2) {
      this.back();
    }
  }

}
