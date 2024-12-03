import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {PlanningsHttpService, UploadRequirementRequetsHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { UploadRequirementRequestModel, SelectUploadRequirementRequestDto, ReadPlanningDto, RequirementModel, SelectRequirementDto, CreateUploadRequirementRequestDto, UpdateUploadRequirementRequestDto } from '@models/uic';
import { AuthService } from '@services/auth';
import { RequirementsHttpService } from '../../../../services/uic/requirement-http.service';

@Component({
  selector: 'app-upload-requirement-request-list',
  templateUrl: './upload-requirement-request-list.component.html',
  // styleUrls: ['./upload-requirement-request-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UploadRequirementRequestListComponent implements OnInit {
  planning:ReadPlanningDto = {}
  //planning:string;
  id: string = '';
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  form: UntypedFormGroup = this.newForm;
  pagination$ = this.requirementsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedRequirements: RequirementModel[] = [];
  selectedRequirement: SelectRequirementDto = {};
  requirements: RequirementModel[] = [];
  actionButtons: MenuItem[] = [];
  archivoField: any;

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private requirementsHttpService: RequirementsHttpService,
    private uploadrequirementRequestsHttpService: UploadRequirementRequetsHttpService,
    private planningsHttpService: PlanningsHttpService,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Home', routerLink: ['/uic/student-informations']},
      {label: 'Enviar Requerimientos'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
    //this.planning = planningsHttpService.plannings
  }

  ngOnInit(){
    this.findActive();
    //this.findAll();
    // this.findByPlanning(0, '15728a0c-ff92-4b80-b6b2-0b68e7ed2d0c');

  }

  // checkState(requirement: RequirementModel): string {
  //   if (requirement.required) return 'success';

  //   return 'danger';
  // }

  // isEnableState(requirement: RequirementModel): string {
  //   if (requirement.isEnable) return 'success';

  //   return 'danger';
  // }

  findAll(page: number = 0) {
    this.requirementsHttpService.findAll(page, this.search.value).subscribe((requirements) => this.requirements = requirements);
  }

  findByPlanning(page: number = 0,planningId:string = '') {
    this.requirementsHttpService.findByPlanning(page, this.search.value,planningId).subscribe((requirements) => this.requirements = requirements);
  }


  getColumns(): ColumnModel[] {
    return [
      {field: 'nameCatalogue', header: 'Nombre del requerimiento'},
      {field: 'description', header: 'Descripción'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [

      // {
      //   label: 'Upload',
      //   icon: 'pi pi-upload',
      //   command: () => {
      //     if (this.selectedRequirement.id)
      //       this.redirectEditForm(this.selectedRequirement.id);
      //   },
      // },
    ];
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

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/upload-requirement-requuests', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/upload-requirement-requuests', id]);
  }

  redirectHome() {
    this.router.navigate(['/uic/student-informations']);
  }

  removerArchivo() {
    this.archivoField = null;
  }

  cargarArchivo(event: any) {
    if (event.files.length) {
      this.archivoField = event.files[0];
    }
  }

  back(): void {
    this.router.navigate(['/uic/upload-requirement-requests']);
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      file: [null, [Validators.nullValidator]],
    });
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.requirementsHttpService.remove(id).subscribe((requirements) => {
            this.requirements = this.requirements.filter(item => item.id !== requirements.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.requirementsHttpService.removeAll(this.selectedRequirements).subscribe((requirements) => {
          this.selectedRequirements.forEach(requirementDeleted => {
            this.requirements = this.requirements.filter(requirement => requirement.id !== requirementDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedRequirements = [];
        });
      }
    });
  }

  create(uploadRequirement: CreateUploadRequirementRequestDto): void {
    this.uploadrequirementRequestsHttpService.create(uploadRequirement).subscribe(UploadRequirement => {
      this.form.reset(uploadRequirement);
      this.redirectHome();
    });
  }

  update(uploadrequirementRequest: UpdateUploadRequirementRequestDto): void {
    this.uploadrequirementRequestsHttpService
    .update(this.id, uploadrequirementRequest)
    .subscribe((uploadrequirementRequest) => {
      this.form.reset(uploadrequirementRequest);
      this.back()
    });
  }

  selectRequirement(requirement: RequirementModel) {
    this.selectedRequirement = requirement;
  }

  findActive () {
    this.planningsHttpService.findActive().subscribe(planning=>{
      this.planning=planning;
      this.findByPlanning(0, planning.id);
    })
    //this.findByPlanning(0, '15728a0c-ff92-4b80-b6b2-0b68e7ed2d0c');
  }

  myUploader(event: any): void {
    console.log(event);
    //const body = new FormData();
    let filename;
    for (let file of event.files) {
      //body.append('file', file);
      //console.log(typeof file.name);
      filename = file.name;
   }
    const file: UploadRequirementRequestModel = {
      file: filename,
    };
    console.log(file)
    this.uploadrequirementRequestsHttpService.create(file).subscribe();
  }



    // Getters
    get fileField() {
      return this.form.controls['file'];
    }
}
