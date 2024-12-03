import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CatalogueModel, ModalityModel, PlanningModel} from '@models/uic';
import {CataloguesHttpService, ModalitiesHttpService, PlanningsHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import { InscriptionsHttpService } from '@services/uic';
import { CreateInscriptionDto, UpdateInscriptionDto } from '@models/uic';
import { ModalityTypeEnum } from '@shared/enums';


@Component({
  selector: 'app-inscription-form',
  templateUrl: './inscription-form.component.html',
  styleUrls: ['./inscription-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InscriptionFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  nameModalities: ModalityModel[] = [];

  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Agregar observación';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;
  archivoField: any;
  states: any;
  selectedStates: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    private planningsHttpService: PlanningsHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private inscriptionsHttpService: InscriptionsHttpService,
    private modalitiesHttpService: ModalitiesHttpService,

  ) {
    this.breadcrumbService.setItems([
      {label: 'Inscripciones', routerLink: ['/uic/inscriptions']},
      {label: 'Formulario'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Update Inscription';
    }
    this.states = [
      { name: 'Matriculado', code: 'MTCL' },
      { name: 'En Proceso', code: 'FENPR' },
      { name: 'Desertor', code: 'DSRT' }
    ];
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getInscription();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      observation: [null,],
      dni: "",
      student: "",
      modality: "",
      document: "",
      requirement: "",
      request: "",
      isEnable: "",
      docUpload: "",
      state: [null,],
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
    this.router.navigate(['/uic/inscriptions']);
  }

  create(inscription: CreateInscriptionDto): void {
    this.inscriptionsHttpService.create(inscription).subscribe(inscription => {
      this.form.reset(inscription);
      this.back();
    });
  }

  getInscription(): void {
    this.isLoadingSkeleton = true;
    this.inscriptionsHttpService.findOne(this.id).subscribe((inscription) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(inscription);
    });
  }

  update(inscription:UpdateInscriptionDto): void {
    this.inscriptionsHttpService.update(this.id, inscription).subscribe((inscription) => {
      this.form.reset(inscription);
      this.back()
    });
  }

  // Getters

  get isEnableField() {
    return this.form.controls['isEnable'];
  }

  get observationField(): AbstractControl {
    return this.form.controls['observation'];
  }

}
