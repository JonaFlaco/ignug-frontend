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
import { EstudiantesHttpService, TeachersHttpService } from '@services/uic';
import { CreateEstudianteDto, UpdateEstudianteDto,EstudianteModel, TeacherModel } from '@models/uic';
import { format } from 'date-fns';
import { FileUploadModule }from 'primeng/fileupload';

@Component({
  selector: 'app-estudiante-form',
  templateUrl: './estudiante-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class EstudianteFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: EstudianteModel[] = [];
  tutor: TeacherModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Estado del estudiante';
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
    private teachersHttpService: TeachersHttpService,
    private estudianteHttpService: EstudiantesHttpService,

  ) {
    this.breadcrumbService.setItems([
      {label: 'Estudiantes', routerLink: ['/uic/estudiantes']},
      {label: 'Form'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar estudiante';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getEstudiante();
    this.loadTeachers();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      dni: [null, [Validators.required, Validators.minLength(10),Validators.maxLength(10)]],
      name: [null, [Validators.required]],
      title: [null, [Validators.required]],
      tutor: [null, [Validators.required]],
      observations: [null, [Validators.required]],
      revisionDate:  [null, [Validators.required]],
      state:  [false, [Validators.required]],
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
    this.router.navigate(['/uic/estudiantes']);
  }

  create(estudiante: CreateEstudianteDto): void {
    this.estudianteHttpService.create(estudiante).subscribe(estudiante => {
      this.form.reset(estudiante);
      this.back();
    });
  }

  getEstudiante(): void {
    this.isLoadingSkeleton = true;
    this.estudianteHttpService.findOne(this.id).subscribe((estudiante) => {
       this.isLoadingSkeleton = false;
       this.form.patchValue(estudiante);

      let revisionDate = format(new Date(estudiante.revisionDate), 'dd/MM/yyyy');
      // // console.log (revisionDate);
      this.revisionDateField.setValue(revisionDate);
    });
  }

  update(estudiante:UpdateEstudianteDto): void {

    this.estudianteHttpService.update(this.id, estudiante).subscribe((estudiante) => {
      this.form.reset(estudiante);
      this.back()
    });
  }
  loadTeachers(): void {
    this.teachersHttpService.findAll().subscribe((tutor) => this.tutor = tutor);
  }

  // Getters
  get dniField() {
    return this.form.controls['dni'];
  }

  get nameField() {
    return this.form.controls['name'];
  }

  get titleField() {
    return this.form.controls['title'];
  }

  get tutorField() {
    return this.form.controls['tutor'];
  }
  get observationsField() {
    return this.form.controls['observations'];
  }


  get revisionDateField() {
    return this.form.controls['revisionDate'];
  }

  get stateField() {
    return this.form.controls['state'];
  }
}
