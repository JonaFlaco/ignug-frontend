import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { AuthService } from '@services/auth';
import { CourtProjectModel, SelectCourtProjectDto } from '@models/uic';
import { CourtProjectsHttpService } from '@services/uic/court-project-http.service';

@Component({
  selector: 'app-court-project-list',
  templateUrl: './court-project-list.component.html',
})
export class CourtProjectListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.courtProjectHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedCourtProjects: CourtProjectModel[] = [];
  selectedCourtProject: SelectCourtProjectDto = {};
  courtProjects: CourtProjectModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private courtProjectHttpService: CourtProjectsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Asignar Proyectos al Tribunal'}
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
    this.courtProjectHttpService.findAll(page, this.search.value).subscribe((courtProjects) => this.courtProjects = courtProjects);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'tribunal', header: 'Tribunal'},
      {field: 'proyect', header: 'Proyecto Asignado'},
      {field: 'place', header: 'Lugar de la defensa'},
      {field: 'defenseAt', header: 'Fecha de la defensa'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedCourtProject.id)
            this.redirectEditForm(this.selectedCourtProject.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedCourtProject.id)
            this.remove(this.selectedCourtProject.id);
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/court-projects', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/court-projects', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.courtProjectHttpService.remove(id).subscribe((courtProject) => {
            this.courtProjects = this.courtProjects.filter(item => item.id !== courtProject.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.courtProjectHttpService.removeAll(this.selectedCourtProjects).subscribe((courtProjects) => {
          this.selectedCourtProjects.forEach(courtProjectDeleted => {
            this.courtProjects = this.courtProjects.filter(courtProject => courtProject.id !== courtProjectDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedCourtProjects = [];
        });
      }
    });
  }

  selectCourtProject(courtProject: CourtProjectModel) {
    this.selectedCourtProject = courtProject;
  }
}
