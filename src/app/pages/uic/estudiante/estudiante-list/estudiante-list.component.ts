import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {EstudiantesHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { EstudianteModel, SelectEstudianteDto } from '@models/uic';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-estudiante-list',
  templateUrl: './estudiante-list.component.html',
  // styleUrls: ['./estudiante-list.component.scss'],
})
export class EstudianteListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.estudianteHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedEstudiantes: EstudianteModel[] = [];
  selectedEstudiante: SelectEstudianteDto = {};
  estudiantes: EstudianteModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private estudianteHttpService: EstudiantesHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Estudiantes'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }



  checkState(event: EstudianteModel): string {
    if (event.state) return 'success';

  return 'danger';
  }

  findAll(page: number = 0) {
    this.estudianteHttpService.findAll(page, this.search.value).subscribe((estudiantes) => this.estudiantes = estudiantes);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'dni', header: 'Cedula'},
      {field: 'name', header: 'Nombre '},
      {field: 'title', header: 'Titulo del anteproyecto'},
      {field: 'tutor', header: 'Tutor Asignado'},
      {field: 'observations', header: 'Observación'},
      {field: 'revisionDate', header: 'Fecha de revisión'},
      {field: 'state', header: 'Estado de aprobacion'},

    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedEstudiante.id)
            this.redirectEditForm(this.selectedEstudiante.id);
        },
      },
      // {
      //   label: 'Eliminar',
      //   icon: 'pi pi-trash',
      //   command: () => {
      //     if (this.selectedEstudiante.id)
      //       this.remove(this.selectedEstudiante.id);
      //   },
      // },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/estudiantes', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/estudiantes', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.estudianteHttpService.remove(id).subscribe((estudiante) => {
            this.estudiantes = this.estudiantes.filter(item => item.id !== estudiante.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.estudianteHttpService.removeAll(this.selectedEstudiantes).subscribe((estudiantes) => {
          this.selectedEstudiantes.forEach(estudianteDeleted => {
            this.estudiantes = this.estudiantes.filter(estudiante => estudiante.id !== estudianteDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedEstudiantes = [];
        });
      }
    });
  }

  selectEstudiante(estudiante: EstudianteModel) {
    this.selectedEstudiante = estudiante;
  }
}
