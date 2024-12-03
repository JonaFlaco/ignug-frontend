import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CreateDownloadFormatDto, DownloadFormatModel, ModalityModel, UpdateDownloadFormatDto} from '@models/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import { DownloadFormatsHttpService, ModalitiesHttpService } from '@services/uic';
import {OnExitInterface} from '@shared/interfaces';
// import { FileUploader } from 'ng2-file-upload';
@Component({
  selector: 'app-download-format-form',
  templateUrl: './download-format-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DownloadFormatFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: DownloadFormatModel [] = [];
  requests:ModalityModel [] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'SOLICITUD';
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
    private downloadFormatsHttpService: DownloadFormatsHttpService,
    private modalitiesHttpService: ModalitiesHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Formatos', routerLink: ['/uic/download-formats']},
      {label: 'Form'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar solicitud';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getDownloadFormat();
    this.loadRequests();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(5),Validators.maxLength(40)]],
      // file: [null, [Validators.required, Validators.minLength(10),Validators.maxLength(40)]],
      request: [false, [Validators.required]],
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
    this.router.navigate(['/uic/download-formats']);
  }

  create(downloadFormat: CreateDownloadFormatDto): void {
    this.downloadFormatsHttpService.create(downloadFormat).subscribe(downloadFormat => {
      this.form.reset(downloadFormat);
      this.back();
    });
  }

  getDownloadFormat(): void {
    this.isLoadingSkeleton = true;
    this.downloadFormatsHttpService.findOne(this.id).subscribe((format) => {
       this.isLoadingSkeleton = false;
       this.form.patchValue(format);

    });
  }

  update(downloadFormat:UpdateDownloadFormatDto): void {

    this.downloadFormatsHttpService.update(this.id, downloadFormat).subscribe((downloadFormat) => {
      this.form.reset(downloadFormat);
      this.back()
    });
  }

  loadRequests(): void {
    this.modalitiesHttpService.findAll().subscribe((request) => this.requests = request);
  }

  // Getters
  get requestField() {
    return this.form.controls['request'];
  }

  get nameField() {
    return this.form.controls['name'];
  }

  // get fileField() {
  //   return this.form.controls['file'];
  // }

}
