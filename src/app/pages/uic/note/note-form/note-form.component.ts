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
import { CreateNoteDto, EstudianteModel, ProjectBenchModel, StudentInformationModel, TeacherModel, UpdateNoteDto } from '@models/uic';
import { EstudiantesHttpService, NotesHttpService, StudentInformationsHttpService, TeachersHttpService } from '@services/uic';
import { CatalogueTypeEnum, StudentInformationTypeEnum } from '@shared/enums';
import { ProjectBenchsHttpService } from '../../../../services/uic/project-bench-http.service';
import { ProjectBenchTypeEnum } from '@shared/enums/projectBench.enum';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class NoteFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  //bloodTypes: TribunalModel[] = [];
  studentInformations: StudentInformationModel[] = [];
  projectBenchs: ProjectBenchModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear Nota';
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private noteHttpService: NotesHttpService,
    private studentInformationsHttpService: StudentInformationsHttpService,
    private projectBenchsHttpService: ProjectBenchsHttpService,
    //private estudiantesHttpService: EstudiantesHttpService,
    //private teachersHttpService: TeachersHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Notas', routerLink: ['/uic/notes']},
      {label: 'Formulario'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Update Note';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getNote();
    this.loadStudentInformations();
    this.loadProjectBenchs();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      studentInformation: [null, [Validators.required]],
      projectBench: [null, [Validators.required]],
      description: [null, [Validators.required]],
      state:[false, [Validators.required]],
      score:  [null, []],
      score2:  [null, []],
      score3:  [null, []],
      score4:  [null, []],
      observation: [null, [Validators.required]],
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
    this.router.navigate(['/uic/notes']);
  }

  create(note: CreateNoteDto): void {
    this.noteHttpService.create(note).subscribe(note => {
      this.form.reset(note);
      this.back();
    });
  }


  getNote(): void {
    this.isLoadingSkeleton = true;
    this.noteHttpService.findOne(this.id).subscribe((note) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(note);
    });
  }

  loadStudentInformations(): void {
    this.studentInformationsHttpService.catalogue(CatalogueTypeEnum.STUDENT_INFORMATION).subscribe((studentInformations) => this.studentInformations = studentInformations);
   }

   loadProjectBenchs(): void {
    this.projectBenchsHttpService.projectBench(ProjectBenchTypeEnum.PROJECT_BENCH).subscribe((projectBenchs) => this.projectBenchs = projectBenchs);
   }

  update(note:UpdateNoteDto): void {
    this.noteHttpService.update(this.id, note).subscribe((note) => {
      this.form.reset(note);
      this.back()
    });
  }

  // Getters

  get studentInformationField() {
    return this.form.controls['studentInformation'];
  }

  get projectBenchField() {
    return this.form.controls['projectBench'];
  }

  get stateField() {
    return this.form.controls['state'];
  }

  get descriptionField() {
    return this.form.controls['description'];
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

  get score4Field() {
    return this.form.controls['score4'];
  }

  get observationField() {
    return this.form.controls['observation'];
  }
}
