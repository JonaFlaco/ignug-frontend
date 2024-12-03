import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { CareerModel } from '@models/core';
import { CreateItemDto, ItemModel, UpdateItemDto } from '@models/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import { CareersHttpService } from '@services/core/careers-http.service';
import { ItemsHttpService } from '@services/uic';
import { CatalogueTypeEnum } from '@shared/enums';
import {OnExitInterface} from '@shared/interfaces';

@Component({
  selector: 'app-item-form',
  templateUrl:'./item-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ItemFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: ItemModel[] = [];
  careers: CareerModel [] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Registrar Item Rubrica';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private itemsHttpService: ItemsHttpService,
    private careersHttpService: CareersHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Items', routerLink: ['/uic/items']},
      {label: 'Formulario'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar Item';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getItem();
    this.getCarrer();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      name :[null,[Validators.required]],
      career :[null,[Validators.required]],
      state: [false, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.id != '') {
        this.update(this.form.value);
      } else {
        this.create(this.form.value);
        const  career = this.newForm.value. career;
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields.then();
    }
  }

  back(): void {
    this.router.navigate(['/uic/items']);
  }


  create(item: CreateItemDto): void {
    this.itemsHttpService.create(item).subscribe(item => {
      this.form.reset(item);
      this.back();
    });
  }


  getItem(): void {
    this.isLoadingSkeleton = true;
    this.itemsHttpService.findOne(this.id).subscribe((item) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(item);
    });
  }

  update(dinamic: UpdateItemDto): void {
    this.itemsHttpService.update(this.id, dinamic).subscribe((item) => {
      this.form.reset(dinamic);
      this.back()
    });
  }

  getCarrer(): void {
    this.isLoadingSkeleton = true;
    this.careersHttpService.career(CatalogueTypeEnum.CAREER).subscribe((careers) => {
      this.isLoadingSkeleton = false;
      this.careers = careers;
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

}
