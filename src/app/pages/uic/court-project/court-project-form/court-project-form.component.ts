import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { CourtProjectModel, CreateCourtProjectDto, UpdateCourtProjectDto, UploadProjectModel } from '@models/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import { UploadProjectsHttpService } from '@services/uic';
import { CourtProjectsHttpService } from '@services/uic/court-project-http.service';
import { CatalogueTypeEnum } from '@shared/enums';
import {OnExitInterface} from '@shared/interfaces';
import { DateValidators } from '@shared/validators';
import { format } from 'date-fns';

@Component({
  selector: 'app-court-project-form',
  templateUrl:'./court-project-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CourtProjectFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: CourtProjectModel[] = [];
  proyects: UploadProjectModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Asignar proyectos a un Tribunal';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private courtProjectsHttpService: CourtProjectsHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private uploadProjectsHttpService: UploadProjectsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Asignar Proyectos al Tribunal', routerLink: ['/uic/court-projects']},
      {label: 'Form'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar la Asignación';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getCourtProject();
    this.getProjects();
  }

  get newForm(): UntypedFormGroup {
    const fechaActual = new Date();
    return this.formBuilder.group({
      tribunal: ['Ej: Tribunal II', [Validators.required]],
      proyect: [null, [Validators.required]],
      place: ['Ej: Auditorio Yavirac', [Validators.required]],
      description: ['Ej: La defensa es en el auditorio', [Validators.required]],
      defenseAt:  [fechaActual, [Validators.required]],
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
    this.router.navigate(['/uic/court-projects']);
  }

  create(courtProject: CreateCourtProjectDto): void {
    this.courtProjectsHttpService.create(courtProject).subscribe(courtProject => {
      this.form.reset(courtProject);
      this.back();
    });
  }


  getCourtProject(): void {
    this.isLoadingSkeleton = true;
    this.courtProjectsHttpService.findOne(this.id).subscribe((courtProject) => {
      this.isLoadingSkeleton = false;
      let defenseAt = format(new Date(courtProject.defenseAt), 'dd/MM/yyyy');
      //courtProject.defenseAt = new Date(courtProject.defenseAt)
      this.form.patchValue(courtProject);
      this.defenseAtField.setValue(defenseAt);
    });
  }

  getProjects(): void {
    this.isLoadingSkeleton = true;
    this.uploadProjectsHttpService.uploadProject(CatalogueTypeEnum.UPLOAD_PROJECT).subscribe((proyects) => {
      this.isLoadingSkeleton = false;
      this.proyects = proyects;
    });
  }

  update(courtProject: UpdateCourtProjectDto): void {
    this.courtProjectsHttpService.update(this.id, courtProject).subscribe((courtProject) => {
      this.form.reset(courtProject);
      this.back()
    });
  }

  // Getters
  get idField() {
    return this.form.controls['id'];
  }

  get tribunalField() {
    return this.form.controls['tribunal'];
  }

  get proyectField() {
    return this.form.controls['proyect'];
  }

  get descriptionField() {
    return this.form.controls['description'];
  }

  get defenseAtField() {
    return this.form.controls['defenseAt'];
  }

  get placeField() {
    return this.form.controls['place'];
  }

}
