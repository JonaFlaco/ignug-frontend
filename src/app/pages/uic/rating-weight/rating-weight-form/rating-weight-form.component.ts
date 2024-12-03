import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  AbstractControl,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { CreateRatingWeightDto, RatingWeightModel, UpdateRatingWeightDto } from '@models/uic/rating-weight.model';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import { RatingWeightsHttpService } from '@services/uic';
import {OnExitInterface} from '@shared/interfaces';

@Component({
  selector: 'app-rating-weight-form',
  templateUrl:'./rating-weight-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class RatingWeightFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: RatingWeightModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Configurar pesos';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private ratingWeightsHttpService: RatingWeightsHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Pesos de calificaciones', routerLink: ['/uic/rating-weights']},
      {label: 'Formulario'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Configurar pesos';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getRatingWeight();
    this.form.setValidators(this.validateSum.bind(this));
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      weightOne: [null, [Validators.required, Validators.pattern(/^0\.\d{1,2}$/)]],
      weightTwo: [null, [Validators.required, Validators.pattern(/^0\.\d{1,2}$/)]],
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
    this.router.navigate(['/uic/rating-weights']);
  }

  create(ratingWeight: CreateRatingWeightDto): void {
    this.ratingWeightsHttpService.create(ratingWeight).subscribe(ratingWeight => {
      this.form.reset(ratingWeight);
      this.back();
    });
  }


  getRatingWeight(): void {
    this.isLoadingSkeleton = true;
    this.ratingWeightsHttpService.findOne(this.id).subscribe((ratingWeight) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(ratingWeight);
    });
  }

  private validateSum(control: AbstractControl): { [key: string]: any } | null {
    const weightOneValue = control.get('weightOne')?.value;
    const weightTwoValue = control.get('weightTwo')?.value;
    const total = weightOneValue + weightTwoValue;

    if (total !== 1) {
      return { invalidSum: true };
    }

    return null;
  }

  update(ratingWeight: UpdateRatingWeightDto): void {
    this.ratingWeightsHttpService.update(this.id, ratingWeight).subscribe((ratingWeight) => {
      this.form.reset(ratingWeight);
      this.back()
    });
  }

  // Getters
  get idField() {
    return this.form.controls['id'];
  }

  get weightOneField() {
    return this.form.controls['weightOne'];
  }

  get weightTwoField() {
    return this.form.controls['weightTwo'];
  }

}
