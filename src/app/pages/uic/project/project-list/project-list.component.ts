import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {ProjectsHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { ProjectModel, SelectProjectDto } from '@models/uic';
import { AuthService } from '@services/auth';


@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.projectsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedProjects: ProjectModel[] = [];
  selectedProject: SelectProjectDto = {};
  projects: ProjectModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private projectsHttpService: ProjectsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Projects'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit() {
    this.findAll();
  }

  checkState(project: ProjectModel): string {
    if (project.approved) return 'success';

    return 'danger';
  }

  findAll(page: number = 0) {
    this.projectsHttpService.findAll(page, this.search.value).subscribe((projects) => this.projects = projects);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'enrollment', header: 'Inscrpción'},
      {field: 'projectPlan', header: 'Anteproyecto'},
      {field: 'title', header: 'Titulo'},
      {field: 'approved', header: 'Aprobado o Reprobado'},
      {field: 'description', header: 'Descripción'},
      {field: 'score', header: 'Calificación'},
      {field: 'observation', header: 'Observación'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Update',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedProject.id)
            this.redirectEditForm(this.selectedProject.id);
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedProject.id)
            this.remove(this.selectedProject.id);
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/projects', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/projects', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.projectsHttpService.remove(id).subscribe((project) => {
            this.projects = this.projects.filter(item => item.id !== project.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.projectsHttpService.removeAll(this.selectedProjects).subscribe((projects) => {
          this.selectedProjects.forEach(projectDeleted => {
            this.projects = this.projects.filter(project=> project.id !== projectDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedProjects = [];
        });
      }
    });
  }

  selectProject(project: ProjectModel) {
    this.selectedProject = project;
  }
}
