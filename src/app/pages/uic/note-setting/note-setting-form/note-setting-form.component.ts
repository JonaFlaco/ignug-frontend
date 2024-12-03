import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentModel } from '@models/core';
import { CreateNoteSettingDto, NoteSettingModel, UpdateNoteSettingDto } from '@models/uic';
import { BreadcrumbService, CoreService, MessageService, StudentsHttpService } from '@services/core';
import { NoteSettingsHttpService } from '@services/uic';
import { StudentTypeEnum } from '@shared/enums/student.enum';
import { OnExitInterface } from '@shared/interfaces';

@Component({
  selector: 'app-note-setting-form',
  templateUrl: './note-setting-form.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class NoteSettingFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: NoteSettingModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Libro de Calificación';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  students: StudentModel[] = [];
  loaded$ = this.coreService.loaded$;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private noteSettingsHttpService: NoteSettingsHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private studentsHttpService: StudentsHttpService,
  ) {
    this.breadcrumbService.setItems([
      { label: 'Libro de Calificacion', routerLink: ['/uic/note-setting'] },
      { label: 'Formulario' },
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Libro de Calificacion';
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
    this.getNoteSetting();
    this.getStudents();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      student: [null, [Validators.required]],
      evaluation: [null, [Validators.required]],
      document: [null, [Validators.required]],
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
    this.router.navigate(['/uic/note-setting']);
  }

  getStudents(): void {
    this.isLoadingSkeleton = true;
    this.studentsHttpService.student(StudentTypeEnum.STUDENT).subscribe((students) => {
      this.isLoadingSkeleton = false;
      this.students = students
    });
  }

  create(noteSetting: CreateNoteSettingDto): void {
    this.noteSettingsHttpService.create(noteSetting).subscribe((noteSetting) => {
      this.form.reset(noteSetting);
      this.back();
    });
  }

  getNoteSetting(): void {
    this.isLoadingSkeleton = true;
    this.noteSettingsHttpService.findOne(this.id).subscribe((noteSetting) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(noteSetting);
    });
  }

  update(noteSetting: UpdateNoteSettingDto): void {
    this.noteSettingsHttpService
      .update(this.id, noteSetting)
      .subscribe((noteSetting) => {
        this.form.reset(noteSetting);
        this.back();
      });
  }

  // Getters
  get idField() {
    return this.form.controls['id'];
  }

  get studentField() {
    return this.form.controls['student'];
  }

  get evaluationField() {
    return this.form.controls['evaluation'];
  }

  get documentField() {
    return this.form.controls['document'];
  }
}
