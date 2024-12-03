import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EnrollmentModel } from '@models/uic';
import {
  CreateRubricNoteDto,
  UpdateRubricNoteDto,
} from '@models/uic/rubric-note.model';
import { TheoricalNoteModel } from '@models/uic/theoretical-note.model';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { EnrollmentsHttpService } from '@services/uic';
import { RubricNotesHttpService } from '@services/uic/rubric-note-http.service';
import { OnExitInterface } from '@shared/interfaces';

@Component({
  selector: 'app-rubric-note-form',
  templateUrl: './rubric-note-form.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class RubricNoteFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: TheoricalNoteModel[] = [];
  students: EnrollmentModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Registrar nota del examén practico';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private rubricNotesHttpService: RubricNotesHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private enrollmentsHttpService: EnrollmentsHttpService
  ) {
    this.breadcrumbService.setItems([{ label: 'Notas del Examén Practico' }]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar nota del examen practico';
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
    if (this.id != '') {
    }
    this.getRubricNote();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      rubric: [null, [Validators.nullValidator]],
      note: [
        'Ej: 70',
        [
          Validators.required,
          Validators.min(3),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      observations: ['Ej: Le falto la pregunta 3', [Validators.nullValidator]],
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
    this.router.navigate(['/uic/home-note']);
  }

  create(rubricNote: CreateRubricNoteDto): void {
    this.rubricNotesHttpService.create(rubricNote).subscribe((rubricNote) => {
      this.form.reset(rubricNote);
      this.back();
    });
  }

  getRubricNote(): void {
    this.isLoadingSkeleton = true;
    this.rubricNotesHttpService.findOne(this.id).subscribe((rubricNote) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(rubricNote);
    });
  }

  update(rubricNote: UpdateRubricNoteDto): void {
    this.rubricNotesHttpService
      .update(this.id, rubricNote)
      .subscribe((rubricNote) => {
        this.form.reset(rubricNote);
        this.back();
      });
  }

  // Getters
  get idField() {
    return this.form.controls['id'];
  }

  get rubricField() {
    return this.form.controls['rubric'];
  }

  get noteField() {
    return this.form.controls['note'];
  }

  get observationsField() {
    return this.form.controls['observations'];
  }
}
