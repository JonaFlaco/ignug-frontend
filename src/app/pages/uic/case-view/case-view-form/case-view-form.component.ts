import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateCaseViewDto, UpdateCaseViewDto } from '@models/uic';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { CaseViewsHttpService } from '@services/uic';
import { OnExitInterface } from '@shared/interfaces';

@Component({
  selector: 'app-case-view-form',
  templateUrl: './case-view-form.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CaseViewFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Asignar Actividades al cronograma';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
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
    private caseViewsHttpService: CaseViewsHttpService
  ) {
    this.breadcrumbService.setItems([
      {
        label: 'Informacion general del proyecto',
        routerLink: ['/uic/case-views'],
      },
      { label: 'Actividades' },
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar Informacion';
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
    this.getCaseView();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      activity: [null, [Validators.required]],
      meetingDate: [null, [Validators.required]],
      description: [null, [Validators.required]],
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
    this.router.navigate(['/uic/case-views']);
  }

  create(caseView: CreateCaseViewDto): void {
    this.caseViewsHttpService.create(caseView).subscribe((caseView) => {
      this.form.reset(caseView);
      this.back();
    });
  }

  getCaseView(): void {
    this.isLoadingSkeleton = true;
    this.caseViewsHttpService.findOne(this.id).subscribe((caseView) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(caseView);
    });
  }

  update(caseView: UpdateCaseViewDto): void {
    this.caseViewsHttpService
      .update(this.id, caseView)
      .subscribe((caseView) => {
        this.form.reset(caseView);
        this.back();
      });
  }

  // Getters

  get activityField() {
    return this.form.controls['activity'];
  }

  get meetingDateField() {
    return this.form.controls['meetingDate'];
  }

  get descriptionField() {
    return this.form.controls['description'];
  }

}
