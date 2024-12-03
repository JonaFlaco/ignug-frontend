
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { CreateComplexivoDto, UpdateComplexivoDto } from '@models/uic/complexivo.model';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import { ComplexivosHttpService } from '@services/uic/complexivo-http.service';
import {OnExitInterface} from '@shared/interfaces';
import { EstudianteModel, TeacherModel } from '@models/uic';
import { EstudiantesHttpService, TeachersHttpService } from '@services/uic';

@Component({
  selector: 'app-complexivo-form',
  templateUrl: './complexivo-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ComplexivoFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  name: EstudianteModel[] = [];
  name2: EstudianteModel[] = [];
  tutor: TeacherModel[] = [];
  president: TeacherModel[] = [];
  vocal: TeacherModel[] = [];
  //bloodTypes: ComplexivoModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear Complexivo';
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private complexivoHttpService: ComplexivosHttpService,
    private estudiantesHttpService: EstudiantesHttpService,
    private teachersHttpService: TeachersHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Complexivos', routerLink: ['/uic/complexivo']},
      {label: 'Form'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Update Tibunal';
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
    this.loadEstudiante2();
    this.loadTeachers();
    this.loadPresidentes();
    this.loadVocals();
    if (this.id!='')this.getComplexivo();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required]],
      name2: [null, [Validators.required]],
      tutor: [null, [Validators.required]],
      president: [null, [Validators.required]],
      vocal:[null, [Validators.required]],
      nameCase: [null, [Validators.required]],

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
    this.router.navigate(['/uic/complexivo']);
  }

  create(complexivo: CreateComplexivoDto): void {
    this.complexivoHttpService.create(complexivo).subscribe(complexivo => {
      this.form.reset(complexivo);
      this.back();
    });
  }


  getComplexivo(): void {
    this.isLoadingSkeleton = true;
    this.complexivoHttpService.findOne(this.id).subscribe((complexivo) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(complexivo);

    });
  }

  update(complexivo:UpdateComplexivoDto): void {
    this.complexivoHttpService.update(this.id, complexivo).subscribe((complexivo) => {
      this.form.reset(complexivo);
      this.back()
    });
  }

  loadEstudiantes(): void {
    this.estudiantesHttpService.findAll().subscribe((name) => this.name = name);
  }

  loadEstudiante2(): void {
    this.estudiantesHttpService.findAll().subscribe((name2) => this.name2 = name2);
  }

  loadTeachers(): void {
    this.teachersHttpService.findAll().subscribe((tutor) => this.tutor = tutor);
  }

  loadPresidentes(): void {
    this.teachersHttpService.findAll().subscribe((president) => this.president = president);
  }

  loadVocals(): void {
  this.teachersHttpService.findAll().subscribe((vocal) => this.vocal = vocal);
  }



  // Getters
  get nameField() {
    return this.form.controls['name'];
  }

  get name2Field() {
    return this.form.controls['name2'];
  }

  get tutorField() {
    return this.form.controls['tutor'];
  }

  get presidentField() {
    return this.form.controls['president'];
  }

  get vocalField() {
    return this.form.controls['vocal'];
  }

  get nameCaseField() {
    return this.form.controls['nameCase'];
  }

}
