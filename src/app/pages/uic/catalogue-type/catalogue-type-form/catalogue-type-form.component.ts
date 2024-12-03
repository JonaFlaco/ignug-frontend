import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CatalogueModel, PlanningModel} from '@models/uic';
import {CataloguesHttpService, PlanningsHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import { CatalogueTypesHttpService } from '@services/uic';
import { CreateCatalogueTypeDto, UpdateCatalogueTypeDto } from '@models/uic';
import { CatalogueTypeEnum } from '@shared/enums';
import { PlanningTypeEnum } from '@shared/enums/planning.enum';
import { format } from 'date-fns';

@Component({
  selector: 'app-catalogue-type-form',
  templateUrl: './catalogue-type-form.component.html',

  encapsulation: ViewEncapsulation.None
})
export class CatalogueTypeFormComponent implements OnInit, OnExitInterface {
  id: string = '';
//   bloodTypes: CatalogueModel[] = [];
//   names: CatalogueModel[] = [];
//   plannings: PlanningModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear tipo de catalogo';
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
    private catalogueTypeHttpService: CatalogueTypesHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Tipo de Catálogo', routerLink: ['/uic/catalogueTypes']},
      {label: 'Formulario'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar Tipo de Catálogo';
    }

  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {

    this.getCatalogueType();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required]],
      code:[null]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.id != '') {
        this.update(this.form.value);
      } else {
        this.form.controls['name'].setValue(this.form.controls['name'].value.toUpperCase());
        const nombreCatalogo = this.nombreCatalogo;
        const newCode = nombreCatalogo + this.generateRandomString(10);
        this.form.controls['code'].setValue(newCode);
        console.log(newCode);
        this.create(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields.then();
    }
  }
  generateRandomString(n: number): string {
    const alphabet = '1234567890MAQTFVJHVabcdefghijklmnopqrstuvwxyz)(!"#$%/=?¡¿*-+.:;';
    let result = '';
    for (let i = 0; i < n; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      result += alphabet[randomIndex];
    }
    return result;
  }
  back(): void {
    this.router.navigate(['/uic/catalogueTypes']);
  }

  create(catalogueType: CreateCatalogueTypeDto): void {
    this.catalogueTypeHttpService.create(catalogueType).subscribe(catalogueType => {
      this.form.reset(catalogueType);
      this.back();
    });
  }


  getCatalogueType(): void {
    this.isLoadingSkeleton = true;
    this.catalogueTypeHttpService.findOne(this.id).subscribe((catalogueType) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(catalogueType);
    });
  }


  update(catalogueType:UpdateCatalogueTypeDto): void {
    this.catalogueTypeHttpService.update(this.id, catalogueType).subscribe((catalogueType) => {
      this.form.reset(catalogueType);
      this.back()
    });
  }

  // Getters

  get nameField() {
    return this.form.controls['name'];
  }
  get codeField() {
    return this.form.controls['code'];
  }

  get nombreCatalogo(): string {
    return this.nameField.value;
  }


}
