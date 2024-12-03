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
import {RolesHttpService} from "@services/auth/roles-http.service";
import {ModalitiesHttpService, CataloguesHttpService} from '@services/uic';
import {CatalogueModel, CreateModalityDto, UpdateModalityDto } from '@models/uic';
import { CatalogueTypeEnum } from '@shared/enums';

@Component({
  selector: 'app-modality-form',
  templateUrl: './modality-form.component.html',
  styleUrls: ['./modality-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalityFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  //careers: CareerModel[] = [];
  bloodTypes: CatalogueModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear Modalidad';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private rolesHttpService: RolesHttpService,
    private modalitiesHttpService: ModalitiesHttpService,
    private catalogueHttpService: CataloguesHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Modalidades', routerLink: ['/uic/modalities']},
      {label: 'Formulario'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Guardar Modalidad';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    //this.getModalityStates();
    this.getModality();
    //this.loadStates();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required ]],
      description: [null, [Validators.required]],
      //career: [null, [Validators.required]],
      state:[false, [Validators.required]],

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
    this.router.navigate(['/uic/modalities']);
  }

  create(modality: CreateModalityDto): void {
    this.modalitiesHttpService.create(modality).subscribe(modality => {
      this.form.reset(modality);
      this.back();
    });
  }

  //loadCareers(): void {
  //  this.careersHttpService.findAll().subscribe((roles) => this.roles = roles);
  //}


  //  loadStates(): void {
  //      this.cataloguesHttpService.catalogue(CatalogueTypeEnum.STATES).subscribe((states) => this.states = states);
  //   }

  // loadModalityStates(): void {
  //   this.cataloguesHttpService.catalogue(CatalogueTypeEnum.MODALITY_STATES).subscribe((states) => this.states = states);
  // }

  getModality(): void {
    this.isLoadingSkeleton = true;
    this.modalitiesHttpService.findOne(this.id).subscribe((modality) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(modality);
    });
  }

  // getModalityStates(): void {
  //   this.isLoadingSkeleton = true;
  //   this.catalogueHttpService.catalogue(CatalogueTypeEnum.MODALITY_STATES).subscribe((states) => {
  //     this.isLoadingSkeleton = false;
  //     this.states = states;
  //   });
  // }

  update(modality: UpdateModalityDto): void {
    this.modalitiesHttpService.update(this.id, modality).subscribe((modality) => {
      this.form.reset(modality);
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

  get careerField() {
    return this.form.controls['career'];
  }

  get stateField() {
    return this.form.controls['state'];
  }

  get descriptionField() {
    return this.form.controls['description'];
  }


}
