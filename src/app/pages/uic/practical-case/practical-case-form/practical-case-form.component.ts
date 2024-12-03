import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleModel } from '@models/auth';
import { CatalogueModel, CreatePracticalCaseDto, StudentInformationModel, TeacherModel, UpdatePracticalCaseDto } from '@models/uic';
import { AuthService } from '@services/auth';
import { BreadcrumbService,CoreService, MessageService, YearsHttpService } from '@services/core';
import { PracticalCasesHttpService, StudentInformationsHttpService, TeachersHttpService } from '@services/uic';
import { DateValidators } from '@shared/validators';

@Component({
  selector: 'app-practical-case-form',
  templateUrl: './practical-case-form.component.html',
  encapsulation: ViewEncapsulation.None
})

export class PracticalCaseFormComponent implements OnInit {
  id: string = '';
  eventSorts: number[] = [];
  bloodTypes: CatalogueModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear Caso Practico';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  students:StudentInformationModel[] = [];
  teachers:TeacherModel[] = [];
  rol:RoleModel={};

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private practicalCasesHttpService: PracticalCasesHttpService,
    private estudiantesHttpService: StudentInformationsHttpService,
    private profesoresHttpService: TeachersHttpService,
    private authService: AuthService
    ) {
      
    this.breadcrumbService.setItems([
      {label: 'Casos Practicos', routerLink: ['/uic/practical-cases']},
      {label: 'Formulario'},
    ]);
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Se actualizo el Caso Practico';
    }
    console.log(authService.roles);
    this.rol=authService.roles.find(role => role.code==='admin');
    if(this.rol){
      this.teacherField.setValidators(Validators.required);
      this.startDateField.setValidators(Validators.required);
      this.endDateField.setValidators(Validators.required)
    }
    else{
      this.teacherField.clearValidators();
      this.startDateField.clearValidators();
      this.endDateField.clearValidators();
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.loadEstudiantes();
    this.loadProfesores();
    if (this.id!='') this.getPracticalCase();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      proyect:[null, [Validators.required]],
      startDate: [new Date(),[Validators.required]],
      endDate: [new Date(),[Validators.required, DateValidators.min(new Date())]],
      student: [null],
      teacher: [null, [Validators.required]],
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
    this.router.navigate(['/uic/practical-cases']);
  }

  create(practicalCase: CreatePracticalCaseDto): void {
    this.practicalCasesHttpService.create(practicalCase).subscribe(practicalCase => {
      this.form.reset(practicalCase);
      this.back();
    });
  }

  getPracticalCase(): void {
    this.isLoadingSkeleton = true;
    this.practicalCasesHttpService.findOne(this.id).subscribe((practicalCase) => {
      this.isLoadingSkeleton = false;
      practicalCase.startDate = new Date(practicalCase.startDate)
      practicalCase.endDate = new Date(practicalCase.endDate)
      this.form.patchValue(practicalCase);
    });
  }



  showField: boolean = false;

  toggleField() {
    this.showField = !this.showField;
  }
  

  loadEstudiantes(): void {
    this.estudiantesHttpService.findAll().subscribe((student) => this.students = student);
  }

  loadProfesores(): void {
    this.profesoresHttpService.findAll().subscribe((teacher) => this.teachers = teacher);
  }

//ACTUALIZAR
  update(practicalCase: UpdatePracticalCaseDto): void {
    this.practicalCasesHttpService.update(this.id, practicalCase).subscribe((practicalCase) => {
      this.form.reset(practicalCase);
      this.back()
    });
  }

//GET
  get idField() {
    return this.form.controls['id'];
  }

  get proyectField() {
    return this.form.controls['proyect'];
  }

  get startDateField() {
    return this.form.controls['startDate'];
  }

  get endDateField() {
    return this.form.controls['endDate'];
  }

  get studentField() {
    return this.form.controls['student'];
  }

  get teacherField() {
    return this.form.controls['teacher'];
  }

}
