import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { EnrollmentModel } from '@models/uic';
import { CreateTheoricalNoteDto, TheoricalNoteModel, UpdateTheoricalNoteDto } from '@models/uic/theoretical-note.model';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import { EnrollmentsHttpService } from '@services/uic';
import { TheoricalNotesHttpService } from '@services/uic/theoretical-note-http.service';
import { CatalogueTypeEnum } from '@shared/enums';
import { StudentTypeEnum } from '@shared/enums/student.enum';
import {OnExitInterface} from '@shared/interfaces';

@Component({
  selector: 'app-theoretical-note-form',
  templateUrl:'./theoretical-note-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TheoricalNoteFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: TheoricalNoteModel[] = [];
  students: EnrollmentModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Registrar nota del examén teórico';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private theoricalNotesHttpService: TheoricalNotesHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private enrollmentsHttpService: EnrollmentsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Listado de Notas', routerLink: ['/uic/home-note']},
      {label: 'Colocar notas del Examén Teórico'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar nota del examen teórico';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    if (this.id != ''){
      this.getStudent();
    }
    this.getTheoricalNote();

    console.log(this.nameField);
    console.log(this.students);
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.nullValidator]],
      note: ['Ej: 70', [Validators.required,Validators.min(3),Validators.pattern("^[0-9]*$")]],
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

  create(theoricalNote: CreateTheoricalNoteDto): void {
    this.theoricalNotesHttpService.create(theoricalNote).subscribe(theoricalNote => {
      this.form.reset(theoricalNote);
      this.back();
    });
  }

  getTheoricalNote(): void {
    this.isLoadingSkeleton = true;
    this.theoricalNotesHttpService.findOne(this.id).subscribe((theoricalNote) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(theoricalNote);
    });
  }

  getStudent(): void {
    this.isLoadingSkeleton = true;
    this.enrollmentsHttpService.catalogue(CatalogueTypeEnum.STUDENT).subscribe((students) => {
      this.isLoadingSkeleton = false;
      this.students = students;
    });
  }

  // loadName(): void {
  //   this.modalitiesHttpService
  //     .modality(ModalityTypeEnum.PLANNING_NAMES)
  //     .subscribe((nameModalities) => (this.nameModalities = nameModalities.filter((modalities)=>modalities.state==true)));
  // }

  update(theoricalNote: UpdateTheoricalNoteDto): void {
    this.theoricalNotesHttpService.update(this.id, theoricalNote).subscribe((theoricalNote) => {
      this.form.reset(theoricalNote);
      this.back()
    });
  }

  // Getters
  get idField() {
    return this.form.controls['id'];
  }

  get nameField() {
    return this.form.controls['name'];
  }

  get noteField() {
    return this.form.controls['note'];
  }

  get observationsField() {
    return this.form.controls['observations'];
  }

}
