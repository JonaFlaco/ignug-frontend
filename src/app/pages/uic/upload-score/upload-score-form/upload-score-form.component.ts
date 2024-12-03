import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { OnExitInterface } from '@shared/interfaces';
import {
  UploadScoresHttpService,
} from '@services/uic';
import {
  CreateUploadScoreDto,
  UpdateUploadScoreDto,
  UploadScoreModel,
} from '@models/uic';
import { CatalogueTypeEnum} from '@shared/enums';
import { CareerModel } from '@models/core';
import { CareersHttpService } from '../../../../services/core/careers-http.service';


@Component({
  selector: 'app-upload-score-form',
  templateUrl: './upload-score-form.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class UploadScoreFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: UploadScoreModel[] = [];
  careers: CareerModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Subir Notas del examan practico ';
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
    private careersHttpService: CareersHttpService,
    private uploadScoresHttpService: UploadScoresHttpService,
  ) {
    this.breadcrumbService.setItems([
      { label: 'Notas del examan practico ', routerLink: ['/uic/upload-scores'] },
      { label: 'Formulario' },
    ]);
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar Notas';
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
    this.getCarrer();
    this.getUploadScore();

  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required]],
      dni: [null, [Validators.required]],
      nameCareer: [null, [Validators.required]],
      score: [null, [Validators.required]],


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
    this.router.navigate(['/uic/upload-scores']);
  }

  create(uploadScore: CreateUploadScoreDto): void {
    this.uploadScoresHttpService.create(uploadScore).subscribe((uploadScore) => {
      this.form.reset(uploadScore);
      this.back();
    });
  }

  getUploadScore(): void {
    this.isLoadingSkeleton = true;
    this.uploadScoresHttpService.findOne(this.id).subscribe((uploadScore) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(uploadScore);
    });
  }


  // loadCareers(): void {
  //   this.careersHttpService.findAll().subscribe((career) => this.careers = career);
  // }

  getCarrer(): void {
       this.isLoadingSkeleton = true;
       this.careersHttpService.career(CatalogueTypeEnum.CAREER).subscribe((careers) => {
         this.isLoadingSkeleton = false;
         this.careers = careers;
       });
     }


  update(uploadScore: UpdateUploadScoreDto): void {
    this.uploadScoresHttpService
      .update(this.id, uploadScore)
      .subscribe((uploadScore) => {
        this.form.reset(uploadScore);
        this.back();
      });
  }

  // Getters
  get idField() {
    return this.form.controls['id'];
  }

  get nameField() {
    return this.form.controls['name'];
  }

  get nameCareerField() {
    return this.form.controls['nameCareer'];
  }

  get dniField() {
    return this.form.controls['dni'];
  }
  get scoreField() {
    return this.form.controls['score'];
  }

}
