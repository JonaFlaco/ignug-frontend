import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateComplexTimelineDto, UpdateComplexTimelineDto, UploadProjectModel } from '@models/uic';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { ComplexTimelinesHttpService, UploadProjectsHttpService } from '@services/uic';
import { CatalogueTypeEnum } from '@shared/enums';
import { OnExitInterface } from '@shared/interfaces';
import { format } from 'date-fns';

@Component({
  selector: 'app-complex-timeline-form',
  templateUrl: './complex-timeline-form.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ComplexTimelineFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  form: UntypedFormGroup = this.newForm;
  uploadProjects: UploadProjectModel[] = [];
  panelHeader: string = 'Asignar Actividades al cronograma';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private complexTimelinesHttpService: ComplexTimelinesHttpService,
    private uploadProjectsHttpService: UploadProjectsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {
        label: 'Informacion general del proyecto',
        routerLink: ['/uic/complex-timelines'],
      },
      { label: 'Actividades' },
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar Informacion';
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
    this.getComplexTimeline();
    this.getProjectName();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      activity: [null, [Validators.required]],
      meetingDate: [null, [Validators.required]],
      description: [null, [Validators.required]],
      topicProject: [null, [Validators.required]]
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
    this.router.navigate(['/uic/complex-timelines']);
  }

  create(complexTimeline: CreateComplexTimelineDto): void {
    this.complexTimelinesHttpService.create(complexTimeline).subscribe((complexTimeline) => {
      this.form.reset(complexTimeline);
      this.back();
    });
  }

  getComplexTimeline(): void {
    this.isLoadingSkeleton = true;
    this.complexTimelinesHttpService.findOne(this.id).subscribe((complexTimeline) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(complexTimeline);
      let meetingDate = format(new Date(complexTimeline.meetingDate), 'dd/MM/yyyy');
      this.meetingDateField.setValue(meetingDate);
    });
  }

  getProjectName(): void {
    this.isLoadingSkeleton = true;
    this.uploadProjectsHttpService.uploadProject(CatalogueTypeEnum.UPLOAD_PROJECT).subscribe((uploadProjects) => {
      this.isLoadingSkeleton = false;
      this.uploadProjects = uploadProjects;
    });
  }

  update(complexTimeline: UpdateComplexTimelineDto): void {
    this.complexTimelinesHttpService
      .update(this.id, complexTimeline)
      .subscribe((complexTimeline) => {
        this.form.reset(complexTimeline);
        this.back();
      });
  }

  // Getters

  get activityField() {
    return this.form.controls['activity'];
  }

  get meetingDateField() {
    return this.form.controls['meetingDate'];
  }

  get descriptionField() {
    return this.form.controls['description'];
  }

  get topicProjectField() {
    return this.form.controls['topicProject'];
  }

}
