import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogueModel, PlanningModel, TeacherModel } from '@models/uic';
import { CataloguesHttpService, PlanningsHttpService, TeachersHttpService } from '@services/uic';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { OnExitInterface } from '@shared/interfaces';
import { RegistersHttpService } from '@services/uic';
import { CreateRegisterDto, UpdateRegisterDto } from '@models/uic';
import { CatalogueTypeEnum } from '@shared/enums';
import { PlanningTypeEnum } from '@shared/enums/planning.enum';
import { format } from 'date-fns';
import { DateValidators } from '@shared/validators';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Crear Registro';
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
    private registersHttpService: RegistersHttpService
  ) {
    this.breadcrumbService.setItems([
      { label: 'Registro', routerLink: ['/uic/registers'] },
      { label: 'Formulario' },
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Update Register';
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
  if (this.id!='') this.getRegister();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required]],
      hours: [null, [Validators.required]],
      //tutor: [null, [Validators.required]],
      date: [new Date(),[Validators.required]],
      //endDate: [new Date(),[Validators.required, DateValidators.min(new Date())]],
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
    this.router.navigate(['/uic/registers']);
  }

  create(register: CreateRegisterDto): void {
    this.registersHttpService.create(register).subscribe((register) => {
      this.form.reset(register);
      this.back();
    });
  }

  getRegister(): void {
    this.isLoadingSkeleton = true;
    this.registersHttpService.findOne(this.id).subscribe((register) => {
      this.isLoadingSkeleton = false;
      register.date = new Date(register.date)
      //register.endDate = new Date(register.endDate)
      this.form.patchValue(register);
    });
  }


  update(register: UpdateRegisterDto): void {
    this.registersHttpService.update(this.id, register).subscribe((register) => {
      this.form.reset(register);
      this.back();
    });
  }

  // Getters

  get nameField() {
    return this.form.controls['name'];
  }
  get hoursField() {
    return this.form.controls['hours'];
  }
  /* get tutorField() {
    return this.form.controls['tutor'];
  } */
  get dateField() {
    return this.form.controls['date'];
  }

  /* get endDateField() {
    return this.form.controls['endDate'];
  } */
}
