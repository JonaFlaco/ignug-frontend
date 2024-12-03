import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { CreateRequirementDto,  PlanningModel,  ReadPlanningDto,  RequirementModel, UpdateRequirementDto,CatalogueModel } from '@models/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import { PlanningsHttpService, RequirementsHttpService, CataloguesHttpService } from '@services/uic';
import { PlanningTypeEnum } from '@shared/enums/planning.enum';
import {OnExitInterface} from '@shared/interfaces';
import { is } from 'date-fns/locale';


@Component({
  selector: 'app-requirement-form',
  templateUrl: './requirement-form.component.html',
  styleUrls: ['./requirement-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RequirementFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  planning:ReadPlanningDto = {}
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear Requerimiento';
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;
  plannings: PlanningModel[] = [];
  nameCatalogue:CatalogueModel[] = [];
  catalogues:CatalogueModel[];
  filteredOptions: CatalogueModel[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private requirementsHttpService: RequirementsHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private planningsHttpService: PlanningsHttpService,
    private cataloguesHttpService: CataloguesHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Convocatorias', routerLink: ['/uic/plannings']},
      {label: `${this.planningsHttpService.plannings.name}`, routerLink: ['/uic/requirements/plannings',this.planningsHttpService.plannings.id]},
      {label: 'Nuevo requerimiento'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar requerimientos';
    }
    this.planning = planningsHttpService.plannings
    console.log(planningsHttpService.plannings)
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    if(
      this.id
    ){

    this.getRequirement();
    }
    this.getPlanningNames();
    this.loadCatalogues();
    this.cataloguesHttpService.findEverything().subscribe((data) => {
      this.catalogues = data;
      this.filterOptions();
      console.log(this.catalogues)
    });
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({

      nameCatalogue: [null, [Validators.required]],

      planning: [null, [Validators.required]],
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

  loadCatalogues(): void {
    this.cataloguesHttpService.findAll().subscribe((nameCatalogue) =>  {
      this.nameCatalogue = nameCatalogue;
    });
  }

  back(planningId: string): void {
    this.router.navigate(['/uic/requirements/plannings',planningId]);
  }

  create(requirement: CreateRequirementDto): void {
    this.requirementsHttpService.create(requirement).subscribe(requirement => {
      this.form.reset(requirement);
      this.back(this.planning.id);
    });
  }

  filterOptions(): void {
    this.filteredOptions = this.catalogues.filter((option) => {
      return option.catalogueType.name ==="REQUERIMIENTOS" && option.state;
    });
  }
  getRequirement(): void {
    this.isLoadingSkeleton = true;
    this.requirementsHttpService.findOne(this.id).subscribe((requirement) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(requirement);
    });
  }
  getPlanningNames(): void {
    this.isLoadingSkeleton = true;
    this.planningsHttpService.planning(PlanningTypeEnum.EVENT_NAMES).subscribe((plannings) => {
      this.isLoadingSkeleton = false;
      this.plannings = plannings;
    });
  }
  update(requirement: UpdateRequirementDto): void {
    this.requirementsHttpService.update(this.id, requirement).subscribe((requirement) => {
      this.form.reset(requirement);
      this.back(this.planning.id)
    });
  }

  // Getters
  get idField() {
    return this.form.controls['id'];
  }

  get nameCatalogueField() {
    return this.form.controls['nameCatalogue'];
  }

  get planningField() {
    return this.form.controls['planning'];
  }
}
