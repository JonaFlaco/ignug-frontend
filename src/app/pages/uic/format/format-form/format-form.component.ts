import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { CreateFormatDto, FormatModel, UpdateFormatDto } from '@models/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import { FormatsHttpService } from '@services/uic/format-http.service';
import {OnExitInterface} from '@shared/interfaces';
// import { FileUploader } from 'ng2-file-upload';
@Component({
  selector: 'app-format-form',
  templateUrl: './format-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class FormatFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: FormatModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Subir Documento';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;
  //archivoField: any;
  private fileTmp: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private formatsHttpService: FormatsHttpService,

  ) {
    this.breadcrumbService.setItems([
      {label: 'Formatos', routerLink: ['/uic/formatos']},
      {label: 'Formulario'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar formatos';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getFormat();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(5),Validators.maxLength(40)]],
      description:[null, [Validators.required, Validators.minLength(10),Validators.maxLength(100)]],
      state:  [false, [Validators.required]],
      file: [null, [Validators.nullValidator]],
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
    this.router.navigate(['/uic/formats']);
  }

  // create(format: CreateFormatDto): void {
  //   const formData= new FormData();
  //   formData.append('file',this.archivoField);

  //   // formData.append('payload',JSON.stringify(this.form.value));
  //   this.formatsHttpService.create(formData).subscribe(format => {
  //     this.form.reset(format);
  //     this.back();
  //   });
  // }
  // removerArchivo() {
  //   this.archivoField.this.archivoField=null;
  // }

  // cargarArchivo(event: any) {
  //   if (event.files.length) {
  //     this.archivoField=event.files[0];
  //   }
  // }


  create(format: CreateFormatDto): void {
    this.formatsHttpService.create(format).subscribe(format => {
      this.form.reset(format);
      this.back();
    });
  }

  getFormat(): void {
    this.isLoadingSkeleton = true;
    this.formatsHttpService.findOne(this.id).subscribe((format) => {
       this.isLoadingSkeleton = false;
       this.form.patchValue(format);

    });
  }

  update(format:UpdateFormatDto): void {

    this.formatsHttpService.update(this.id, format).subscribe((estudiante) => {
      this.form.reset(format);
      this.back()
    });
  }

  myUploader(event: any): void {
    console.log(event);
    const body = new FormData();

    for (let file of event.files) {
      body.append('file', file);
      console.log(typeof file.name);
      this.fileField.setValue(file.name);
    }

    // this.requirementsHttpService.upload(body).subscribe((file) => {console.log(file);});
  }

  // Getters
  get nameField() {
    return this.form.controls['name'];
  }

  get descriptionField() {
    return this.form.controls['description'];
  }

  get stateField() {
    return this.form.controls['state'];
  }

   get fileField() {
    return this.form.controls['file'];
  }
}
