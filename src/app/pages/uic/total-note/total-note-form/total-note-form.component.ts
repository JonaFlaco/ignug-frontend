import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { CreateTotalNoteDto, TotalNoteModel, UpdateTotalNoteDto } from '@models/uic/total-note.model';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import { TotalNotesHttpService } from '@services/uic';
import {OnExitInterface} from '@shared/interfaces';

@Component({
  selector: 'app-total-note-form',
  templateUrl:'./total-note-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TotalNoteFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: TotalNoteModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Colocar notas';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private totalNotesHttpService: TotalNotesHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Notas finales', routerLink: ['/uic/total-notes']},
      {label: 'Formulario'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Colocar notas';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getTotalNote();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      noteOne: [null, [Validators.required]],
      noteTwo: [null, [Validators.required]],
      finalNote: [null, [Validators.required]],
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
    this.router.navigate(['/uic/total-notes']);
  }

  create(totalNote: CreateTotalNoteDto): void {
    this.totalNotesHttpService.create(totalNote).subscribe(totalNote => {
      this.form.reset(totalNote);
      this.back();
    });
  }


  getTotalNote(): void {
    this.isLoadingSkeleton = true;
    this.totalNotesHttpService.findOne(this.id).subscribe((totalNote) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(totalNote);
    });
  }

  update(totalNote: UpdateTotalNoteDto): void {
    this.totalNotesHttpService.update(this.id, totalNote).subscribe((totalNote) => {
      this.form.reset(totalNote);
      this.back()
    });
  }

  // Getters
  get idField() {
    return this.form.controls['id'];
  }

  get noteOneField() {
    return this.form.controls['noteOne'];
  }

  get noteTwoField() {
    return this.form.controls['noteTwo'];
  }

  get finalNoteField() {
    return this.form.controls['finalNote'];
  }

}
