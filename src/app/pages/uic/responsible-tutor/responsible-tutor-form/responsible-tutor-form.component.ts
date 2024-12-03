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
import {ResponsibleTutorsHttpService, EstudiantesHttpService, EventsHttpService } from '@services/uic';
import { CreateResponsibleTutorDto, UpdateResponsibleTutorDto,ResponsibleTutorModel, EstudianteModel, EventModel } from '@models/uic';
import { format } from 'date-fns';
import { FileUploadModule }from 'primeng/fileupload';

@Component({
  selector: 'app-responsible-tutor-form',
  templateUrl: './responsible-tutor-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ResponsibleTutorFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  //bloodTypes: ResponsibleTutorModel[] = [];
  nameStudent: EstudianteModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Revisar proyecto';
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
    private estudiantesHttpService: EstudiantesHttpService,
    private responsibleTutorHttpService: ResponsibleTutorsHttpService,

  ) {
    this.breadcrumbService.setItems([
      {label: 'ResponsibleTutors', routerLink: ['/uic/responsible-tutors']},
      {label: 'Form'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar responsible tutor';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getResponsibleTutor();
    this.loadEstudiantes();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      approved: [false, [Validators.required]],
      observation: [null, [Validators.minLength(10)]],
      score: [null, [Validators.required]],
      nameStudent: [null, [Validators.required]],
      date: [null, [Validators.required]],
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
    this.router.navigate(['/uic/responsible-tutors']);
  }

  create(responsibleTutor: CreateResponsibleTutorDto): void {
    this.responsibleTutorHttpService.create(responsibleTutor).subscribe(responsibleTutor => {
      this.form.reset(responsibleTutor);
      this.back();
    });
  }

  getResponsibleTutor(): void {
    this.isLoadingSkeleton = true;
    this.responsibleTutorHttpService.findOne(this.id).subscribe((responsibleTutor) => {
       this.isLoadingSkeleton = false;
       this.form.patchValue(responsibleTutor);
    });
  }


  update(responsibleTutor:UpdateResponsibleTutorDto): void {
    this.responsibleTutorHttpService.update(this.id, responsibleTutor).subscribe((responsibleTutor) => {
      this.form.reset(responsibleTutor);
      this.back()
    });
  }


  loadEstudiantes(): void {
    this.estudiantesHttpService.findAll().subscribe((nameStudent) => this.nameStudent = nameStudent);
  }



  // Getters
  get nameStudentField() {
    return this.form.controls['nameStudent'];
  }

  get approvedField() {
    return this.form.controls['approved'];
  }

  get observationField() {
    return this.form.controls['observation'];
  }

  get scoreField() {
    return this.form.controls['score'];
  }

  get dateField() {
    return this.form.controls['date'];
  }

}
