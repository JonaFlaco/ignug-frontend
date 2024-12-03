import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { CreateTribunalDto, TribunalModel, UpdateTribunalDto } from '@models/uic/tribunal.model';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import { TribunalsHttpService } from '@services/uic/tribunal-http.service';
import {OnExitInterface} from '@shared/interfaces';
import { format } from 'date-fns';
import { EstudianteModel, TeacherModel } from '@models/uic';
import { EstudiantesHttpService, TeachersHttpService } from '@services/uic';

@Component({
  selector: 'app-tribunal-form',
  templateUrl: './tribunal-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TribunalFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  name: EstudianteModel[] = [];
  tutor: TeacherModel[] = [];
  president: TeacherModel[] = [];
  vocal: TeacherModel[] = [];
  //bloodTypes: TribunalModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear Tribunal';
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private tribunalHttpService: TribunalsHttpService,
    private estudiantesHttpService: EstudiantesHttpService,
    private teachersHttpService: TeachersHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Tribunals', routerLink: ['/uic/tribunals']},
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
    this.loadTeachers();
    this.loadPresidentes();
    this.loadVocals();
    this.getTribunal();
    // this.getEstudiante();
    // this.getTeacher();

  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required]],
      tutor: [null, [Validators.required]],
      president: [null, [Validators.required]],
      vocal:[null, [Validators.required]],
      score:  [null, [Validators.required,]],
      score2:  [null, [Validators.required]],
      score3:  [null, [Validators.required]],
      date: [null, [Validators.required]],
      place:  [null, [Validators.required,Validators.minLength(10),Validators.maxLength(30)]],

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
    this.router.navigate(['/uic/tribunals']);
  }

  create(tribunal: CreateTribunalDto): void {
    this.tribunalHttpService.create(tribunal).subscribe(tribunal => {
      this.form.reset(tribunal);
      this.back();
    });
  }


  getTribunal(): void {
    this.isLoadingSkeleton = true;
    this.tribunalHttpService.findOne(this.id).subscribe((tribunal) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(tribunal);
      // let date = format(new Date(tribunal.date), 'dd/MM/yyyy');
      // console.log (date);
    });
  }

  update(tribunal:UpdateTribunalDto): void {
    this.tribunalHttpService.update(this.id, tribunal).subscribe((tribunal) => {
      this.form.reset(tribunal);
      this.back()
    });
  }

  loadEstudiantes(): void {
    this.estudiantesHttpService.findAll().subscribe((name) => this.name = name);
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

  get tutorField() {
    return this.form.controls['tutor'];
  }

  get presidentField() {
    return this.form.controls['president'];
  }

  get vocalField() {
    return this.form.controls['vocal'];
  }

  get scoreField() {
    return this.form.controls['score'];
  }

  get score2Field() {
    return this.form.controls['score2'];
  }

  get score3Field() {
    return this.form.controls['score3'];
  }


  get dateField() {
    return this.form.controls['date'];
  }


  get placeField() {
    return this.form.controls['place'];
  }


}
