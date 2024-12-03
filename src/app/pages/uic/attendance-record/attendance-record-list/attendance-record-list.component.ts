import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {PlanningsHttpService,AttendanceRecordHttpService, EstudiantesHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { AttendanceRecordModel, SelectAttendanceRecordDto, ReadPlanningDto, RequirementModel, SelectRequirementDto, EstudianteModel, SelectEstudianteDto } from '@models/uic';
import { AuthService } from '@services/auth';
import { RequirementsHttpService } from '../../../../services/uic/requirement-http.service';

@Component({
  selector: 'app-attendance-record-list',
  templateUrl: './attendance-record-list.component.html',
  // styleUrls: ['./upload-requirement-request-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AttendanceRecordListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.estudianteHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedEstudiantes: EstudianteModel[] = [];
  selectedEstudiante: SelectEstudianteDto = {};
  estudiantes: EstudianteModel[] = [];
  actionButtons: MenuItem[] = [];
  fechaActual = new Date();

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private estudianteHttpService: EstudiantesHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Regsitro de Asistencias'}
    ]);
    this.columns = this.getColumns();
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
      {field: 'name', header: 'Nombre '},
      {field: 'dni', header: 'Cedula'},
    ]
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
