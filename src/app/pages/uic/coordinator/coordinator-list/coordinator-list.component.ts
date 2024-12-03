import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ColumnModel, PaginatorModel } from '@models/core';
import { CoordinatorModel, SelectCoordinatorDto} from '@models/uic';
import { CoreService, MessageService, BreadcrumbService } from '@services/core';
import { CoordinatorsHttpService } from '@services/uic';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-coordinator-list',
  templateUrl: './coordinator-list.component.html',
  styleUrls: ['./coordinator-list.component.scss']
})
export class CoordinatorListComponent implements OnInit {

  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.coordinatorsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  coordinators: CoordinatorModel[] = [];
  selectedCoordinators: CoordinatorModel[] = [];
  selectedCoordinator: SelectCoordinatorDto = {};
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private coordinatorsHttpService: CoordinatorsHttpService,
    private router: Router,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Lista de solicitudes de anteproyecto'}
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
    this.coordinatorsHttpService.findAll(page, this.search.value).subscribe((coordinators) => this.coordinators = coordinators);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'planning', header: 'Convocatoria'},
      {field: 'title', header: 'Titulo'},
      {field: 'requestedAt', header: 'Fecha de solicitud'},
      {field: 'answeredAt', header: 'Fecha de respuesta'},
      {field: 'tutor', header: 'Docente Tutor'},
      {field: 'observacion', header: 'Observaciones'},
      {field: 'state', header: 'Estado'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Revision',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedCoordinator.id)
            this.redirectEditForm(this.selectedCoordinator.id);
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedCoordinator.id)
            this.remove(this.selectedCoordinator.id);
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  //Descargar
  redirectEditForm(id: string) {
    this.router.navigate(['/uic/coordinators', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.coordinatorsHttpService.remove(id).subscribe((coordinator) => {
            this.coordinators = this.coordinators.filter(item => item.id !== coordinator.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.coordinatorsHttpService.removeAll(this.selectedCoordinators).subscribe((tutorAssignments) => {
          this.selectedCoordinators.forEach(coordinatorDeleted => {
            this.coordinators = this.coordinators.filter(coordinator => coordinator.id !== coordinatorDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedCoordinators = [];
        });
      }
    });
  }

  selectCoordinator(coordinator: CoordinatorModel) {
    this.selectedCoordinator = coordinator;
  }

  /*download(){
    CoordinatorsHttpService.downloadfile('http://localhost:4200/assets/shape-up.pdf','downloadfile')
  }*/

}
