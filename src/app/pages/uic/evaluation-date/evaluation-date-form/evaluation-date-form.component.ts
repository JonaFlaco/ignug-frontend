import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { CreateEvaluationDateDto, EvaluationDateModel, UpdateEvaluationDateDto } from '@models/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import { EvaluationDateHttpService } from '@services/uic';
import {OnExitInterface} from '@shared/interfaces';

@Component({
  selector: 'app-evaluation-date-form',
  templateUrl:'./evaluation-date-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class EvaluationDateFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: EvaluationDateModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Registrar docentes';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private evaluationDateHttpService: EvaluationDateHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
  ) {
    this.breadcrumbService.setItems([
      {label: 'EvaluationDate', routerLink: ['/uic/evaluation-date']},
      {label: 'Form'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Update EvaluationDate';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getEvaluationDate();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      tutor: [null, [Validators.required,Validators.minLength(10),Validators.maxLength(40)]],
      dni: [null, [Validators.required,Validators.minLength(10),Validators.maxLength(10)]],
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
    this.router.navigate(['/uic/evaluation-date']);
  }

  create(evaluationDate: CreateEvaluationDateDto): void {
    this.evaluationDateHttpService.create(evaluationDate).subscribe(evaluationDate => {
      this.form.reset(evaluationDate);
      this.back();
    });
  }


  getEvaluationDate(): void {
    this.isLoadingSkeleton = true;
    this.evaluationDateHttpService.findOne(this.id).subscribe((evaluationDate) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(evaluationDate);
    });
  }

  update(evaluationDate: UpdateEvaluationDateDto): void {
    this.evaluationDateHttpService.update(this.id, evaluationDate).subscribe((evaluationDate) => {
      this.form.reset(evaluationDate);
      this.back()
    });
  }

  // Getters
  get idField() {
    return this.form.controls['id'];
  }

  get tutorField() {
    return this.form.controls['tutor'];
  }

  get dniField() {
    return this.form.controls['dni'];
  }

}
