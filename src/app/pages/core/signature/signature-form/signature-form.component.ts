import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CreateSignatureCatDto } from '@models/core';
import { CatalogueModel, EstudianteModel, TeacherModel, UpdateSignatureDto} from '@models/uic';
import { BreadcrumbService,CoreService, MessageService, SignaturesCatHttpService } from '@services/core';
import { EstudiantesHttpService, TeachersHttpService} from '@services/uic';

import { CatalogueTypeEnum } from '@shared/enums';
import { DateValidators } from '@shared/validators';

@Component({
  selector: 'app-signature-form',
  templateUrl: './signature-form.component.html',
  encapsulation: ViewEncapsulation.None
})

export class SignatureFormComponent implements OnInit {

  id: string = '';
  bloodTypes: CatalogueModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear Asignatura';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private signaturesCatHttpService: SignaturesCatHttpService,
    private estudiantesHttpService: EstudiantesHttpService,
    private profesoresHttpService: TeachersHttpService,
    ) {

    this.breadcrumbService.setItems([
      {label: 'Signatures', routerLink: ['/core/signatures']},
      {label: 'Formulario'},
    ]);
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Se actualizo Signature';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    if (this.id!='') this.getSignature();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      name:[null, [Validators.required]],
      code:[null],
      description: [null, [Validators.required]],
      state: [false, [Validators.required]],

    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.id != '') {
        this.update(this.form.value);
      } else {
        this.form.controls['name'].setValue(this.form.controls['name'].value.toUpperCase());
        const nombreAsignatura = this.nombreAsignatura;
        const newCode = nombreAsignatura + this.generateRandomString(10);
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
    this.router.navigate(['/core/signatures']);
  }

  create(signature: CreateSignatureCatDto): void {
    this.signaturesCatHttpService.create(signature).subscribe(signature => {
      this.form.reset(signature);
      this.back();
    });
  }

  getSignature(): void {
    this.isLoadingSkeleton = true;
    this.signaturesCatHttpService.findOne(this.id).subscribe((signature) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(signature);
    });
  }

  


//ACTUALIZAR
  update(signature: UpdateSignatureDto): void {
    this.signaturesCatHttpService.update(this.id, signature).subscribe((signature) => {
      this.form.reset(signature);
      this.back()
    });
  }

//GET
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

  get codeField() {
    return this.form.controls['code'];
  }

  get nombreAsignatura(): string {
    return this.nameField.value;
  }

}
