import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogueModel, PlanningModel } from '@models/uic';
import { CataloguesHttpService, PlanningsHttpService } from '@services/uic';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { OnExitInterface } from '@shared/interfaces';
import { YearsHttpService } from '@services/core';
import { CreateYearDto, UpdateYearDto } from '@models/core';
import { CatalogueTypeEnum } from '@shared/enums';
import { PlanningTypeEnum } from '@shared/enums/planning.enum';
import { format } from 'date-fns';

@Component({
  selector: 'app-year-form',
  templateUrl: './year-form.component.html',
  styleUrls: ['./year-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class YearFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  //   bloodTypes: CatalogueModel[] = [];
  //   names: CatalogueModel[] = [];
  //   plannings: PlanningModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear Año Lectivo';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    private planningsHttpService: PlanningsHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private yearsHttpService: YearsHttpService
  ) {
    this.breadcrumbService.setItems([
      { label: 'Years', routerLink: ['/core/years'] },
      { label: 'Form' },
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Update Year';
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
    // this.getCatalogueNames();
    // this.getPlanningNames();
    this.getYear();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      year: [null, [Validators.required]],
      // planning: [null],
      // endDate: [null, [Validators.required]],
      // startDate:  [null, [Validators.required]],
      // isEnable: [false, [Validators.required]],
      // sort:  [null, [Validators.required]],
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
    this.router.navigate(['/core/years']);
  }

  create(year: CreateYearDto): void {
    this.yearsHttpService.create(year).subscribe((year) => {
      this.form.reset(year);
      this.back();
    });
  }

  // loadCatalogues(): void {
  //    this.cataloguesHttpService.findAll().subscribe((name) => this.names = name);
  //  }

  //  loadPlannings(): void {
  //    this.planningsHttpService.findAll().subscribe((planning) => this.plannings = planning);
  //  }

  getYear(): void {
    this.isLoadingSkeleton = true;
    this.yearsHttpService.findOne(this.id).subscribe((year) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(year);
    });
  }

  // getCatalogueNames(): void {
  //   this.isLoadingSkeleton = true;
  //   this.cataloguesHttpService.catalogue(CatalogueTypeEnum.EVENT_NAMES).subscribe((names) => {
  //     this.isLoadingSkeleton = false;
  //     this.names = names;
  //   });
  // }

  // getPlanningNames(): void {
  //   this.isLoadingSkeleton = true;
  //   this.planningsHttpService.planning(PlanningTypeEnum.EVENT_NAMES).subscribe((plannings) => {
  //     this.isLoadingSkeleton = false;
  //     this.plannings = plannings;
  //   });
  // }

  update(year: UpdateYearDto): void {
    this.yearsHttpService.update(this.id, year).subscribe((year) => {
      this.form.reset(year);
      this.back();
    });
  }

  // Getters

  get yearField() {
    return this.form.controls['year'];
  }


  // get planningField() {
  //   return this.form.controls['planning'];
  // }

  // get startDateField() {
  //   return this.form.controls['startDate'];
  // }

  // get endDateField() {
  //   return this.form.controls['endDate'];
  // }

  // get isEnableField() {
  //   return this.form.controls['isEnable'];
  // }

  // get sortField() {
  //   return this.form.controls['sort'];
  // }
}
