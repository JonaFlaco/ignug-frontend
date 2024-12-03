import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { AuthService } from '@services/auth';
import { SelectUploadProjectDto, UploadProjectModel } from '@models/uic';
import { UploadProjectsHttpService } from '@services/uic';

@Component({
  selector: 'app-view-upload-project-list',
  templateUrl: './view-upload-project-list.component.html',
})
export class ViewUploadProjectListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.uploadProjectsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedUploadProjects: UploadProjectModel[] = [];
  selectedUploadProject: SelectUploadProjectDto = {};
  uploadProjects: UploadProjectModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private uploadProjectsHttpService: UploadProjectsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Revisión del caso'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }



  findAll(page: number = 0) {
    this.uploadProjectsHttpService.findAll(page, this.search.value).subscribe((uploadProjects) => this.uploadProjects = uploadProjects);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'theme', header: 'Tema del proyecto'},
      {field: 'members', header: 'Integrantes'},
      {field: 'summary', header: 'Resumen del proyecto'},
      {field: 'nameCareer', header: 'Carrera'},

    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Eliminar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedUploadProject.id)
            this.redirectEditForm(this.selectedUploadProject.id);
        },
      },
      {
        label: 'Actualizar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedUploadProject.id)
            this.remove(this.selectedUploadProject.id);
        },
      },
    ];
  }

  paginate(uploadProject: any) {
    this.findAll(uploadProject.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/upload-projects', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/upload-projects', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.uploadProjectsHttpService.remove(id).subscribe((uploadProject) => {
            this.uploadProjects = this.uploadProjects.filter(item => item.id !== uploadProject.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.uploadProjectsHttpService.removeAll(this.selectedUploadProjects).subscribe((uploadProjects) => {
          this.selectedUploadProjects.forEach(uploadProjectDeleted => {
            this.uploadProjects = this.uploadProjects.filter(uploadProject=> uploadProject.id !== uploadProjectDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedUploadProjects = [];
        });
      }
    });
  }

  selectUploadProject(uploadProject:UploadProjectModel) {
    this.selectedUploadProject = uploadProject;
  }
}
