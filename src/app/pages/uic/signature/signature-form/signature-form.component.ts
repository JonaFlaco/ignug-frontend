import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReadPreparationCourseDto, SignatureModel} from '@models/uic';
import { CataloguesHttpService, PlanningsHttpService, PreparationCoursesHttpService } from '@services/uic';
import { BreadcrumbService, CoreService, MessageService, SignaturesCatHttpService, TeachersHttpService } from '@services/core';
import { OnExitInterface } from '@shared/interfaces';
import { SignaturesHttpService } from '@services/uic';
import { CreateSignatureDto, UpdateSignatureDto } from '@models/uic';
import { CatalogueTypeEnum } from '@shared/enums';
import { DateValidators } from '@shared/validators';
import { SignatureCatModel, TeacherModel } from '@models/core';

@Component({
  selector: 'app-signature-form',
  templateUrl: './signature-form.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SignatureFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Designar Asignatura';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;
  tutor: TeacherModel[] = [];
  search: UntypedFormControl = new UntypedFormControl('');
  signatures:SignatureModel[];
  preparationCourse:ReadPreparationCourseDto = {};
  signaturesCat: SignatureCatModel[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    private planningsHttpService: PlanningsHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private teachersHttpService: TeachersHttpService,
    private signaturesHttpService: SignaturesHttpService,
    private signaturesCatHttpService: SignaturesCatHttpService,
    private preparationCoursesHttpService: PreparationCoursesHttpService,
  ) {
    this.breadcrumbService.setItems([
      { label: 'Cursos', routerLink: ['/uic/preparation-courses'] },
      {label: `${this.preparationCoursesHttpService.preparationCourses.name}`, routerLink: ['/uic/signatures/preparationCourses',this.preparationCoursesHttpService.preparationCourses.id]},
      { label: 'Nueva asignatura' },
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Update Signature';
    }
    this.preparationCourse = preparationCoursesHttpService.preparationCourses
    console.log(preparationCoursesHttpService.preparationCourses)
    console.log(this.preparationCoursesHttpService.preparationCourses.endDate)
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
    this.getCatSignatures();
    this.getSignatures();
    this.loadTeachers();
  if (this.id) {
    this.getSignature();
  }
  }

  get newForm(): UntypedFormGroup {
    const maxEndDate = this.preparationCoursesHttpService.preparationCourses.endDate;
    return this.formBuilder.group({
      hours: [null, [Validators.required]],
      tutor: [null, [Validators.required]],
      startDate: [null, [DateValidators.min(new Date())]],
      endDate: [
        null, 
        [Validators.required,
          (control: AbstractControl) => {
            const endDateValue = control.value;
            const maxEndDate = this.preparationCoursesHttpService.preparationCourses.endDate;
            const maxEndDateFormatted = new Date(maxEndDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' });
            const endDateValueNum = endDateValue ? new Date(endDateValue).getTime() : null;
            const maxEndDateNum = new Date(maxEndDate).getTime();
            if (endDateValueNum && endDateValueNum > maxEndDateNum) {
              return { endDateMaxError: `La fecha no puede ser posterior a la fecha máxima de la convocatoria (${maxEndDateFormatted})` };
            }
            return null;
          },
          DateValidators.min(new Date())
        ]
      ],      preparationCourse: [null, [Validators.required]],
      signature: [null, [Validators.required]],

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

  getSignatures(page: number = 0,preparationCourseId:string=`${this.preparationCoursesHttpService.preparationCourses.id}`):void{
    this.signaturesHttpService.findByPreparationCourse(page,this.search.value,preparationCourseId).subscribe(signatures =>{
      this.signatures =signatures;
      console.log(signatures);
    })
  }

  getCatSignatures(): void {
    this.isLoadingSkeleton = true;
    this.signaturesCatHttpService.signature(CatalogueTypeEnum.CAREER).subscribe((signaturesCat) => {
      this.isLoadingSkeleton = false;
      this.signaturesCat = signaturesCat;
      console.log(this.signaturesCat)
    });
  }

  back(preparationCourseId:string): void {
    this.router.navigate(['/uic/signatures/preparationCourses',preparationCourseId]);
  }

  create(signature: CreateSignatureDto): void {
    this.signaturesHttpService.create(signature).subscribe((signature) => {
      this.form.reset(signature);
      this.back(this.preparationCourse.id);
    });
  }
  loadTeachers(): void {
    this.teachersHttpService.findAll().subscribe((teacher) => this.tutor = teacher);
    console.log(this.tutor);
  }

  getSignature(): void {
    this.isLoadingSkeleton = true;
    this.signaturesHttpService.findOne(this.id).subscribe((signature) => {
      this.isLoadingSkeleton = false;
      signature.startDate = new Date(signature.startDate)
      signature.endDate = new Date(signature.endDate)
      this.form.patchValue(signature);
    });
  }


  update(signature: UpdateSignatureDto): void {
    this.signaturesHttpService.update(this.id, signature).subscribe((signature) => {
      this.form.reset(signature);
      this.back(this.preparationCourse.id);
    });
  }

  // Getters

  get nameField() {
    return this.form.controls['name'];
  }
  get hoursField() {
    return this.form.controls['hours'];
  }
  get tutorField() {
    return this.form.controls['tutor'];
  }
  get startDateField() {
    return this.form.controls['startDate'];
  }

  get signatureField() {
    return this.form.controls['signature'];
  }

  get endDateField() {
    return this.form.controls['endDate'];
  }
  get preparationCourseField() {
    return this.form.controls['preparationCourse'];
  }
}
