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
import { CatalogueModel, CatalogueTypeModel, CreateCatalogueDto, UpdateCatalogueDto } from '@models/uic';
import { CataloguesHttpService, CatalogueTypesHttpService } from '@services/uic';
import { CatalogueTypeEnum } from '@shared/enums';

@Component({
  selector: 'app-catalogue-form',
  templateUrl: './catalogue-form.component.html',
  styleUrls: ['./catalogue-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CatalogueFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: CatalogueModel[] = [];
  catalogueTypes: CatalogueTypeModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear Catalogo';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    private catalogueTypesHttpService: CatalogueTypesHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Catálogo', routerLink: ['/uic/catalogues']},
      {label: 'Formulario'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar Catálogo';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getCatalogue();
    this.getCatalogueType();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      state: [false, [Validators.required]],
      catalogueType:[null, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.id != '') {
        this.update(this.form.value);
      } else {
        this.create(this.form.value);
        const catalogueType = this.newForm.value.catalogueType;
        console.log(catalogueType)
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields.then();
    }
  }

  back(): void {
    this.router.navigate(['/uic/catalogues']);
  }

  create(catalogue: CreateCatalogueDto): void {
    this.cataloguesHttpService.create(catalogue).subscribe(catalogue => {
      this.form.reset(catalogue);
      this.back();
    });
  }

  getCatalogueType(): void {
    this.isLoadingSkeleton = true;
    this.catalogueTypesHttpService
      .catalogueType(CatalogueTypeEnum.CATALOGUE_TYPE)
      .subscribe((catalogueType) => {
        this.isLoadingSkeleton = false;
        this.catalogueTypes = catalogueType;
      });
  }
  getCatalogue(): void {
    this.isLoadingSkeleton = true;
    this.cataloguesHttpService.findOne(this.id).subscribe((catalogue) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(catalogue);
    });
  }

  update(catalogue: UpdateCatalogueDto): void {
    this.cataloguesHttpService.update(this.id, catalogue).subscribe((catalogue) => {
      this.form.reset(catalogue);
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

  get descriptionField() {
    return this.form.controls['description'];
  }

  get stateField() {
    return this.form.controls['state'];
  }


  get catalogueTypeField() {
    return this.form.controls['catalogueType'];
  }
}
