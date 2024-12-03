import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ColumnModel, PaginatorModel } from '@models/core';
import { SelectTutorAssignmentDto, TutorAssignmentModel } from '@models/uic';
import { CoreService, MessageService, BreadcrumbService } from '@services/core';
import { TutorAssignmentsHttpService } from '@services/uic';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-tutor-assignment-list',
  templateUrl: './tutor-assignment-list.component.html',
})
export class TutorAssignmentListComponent implements OnInit {

  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.tutorAssignmentsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  tutorAssignments: TutorAssignmentModel[] = [];
  selectedTutorAssignments: TutorAssignmentModel[] = [];
  selectedTutorAssignment: SelectTutorAssignmentDto = {};
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private tutorAssignmentsHttpService: TutorAssignmentsHttpService,
    private router: Router,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Asignación tutor'}
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
    this.tutorAssignmentsHttpService.findAll(page, this.search.value).subscribe((tutorAssignments) => this.tutorAssignments = tutorAssignments);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'student', header: 'Estudiantes/Integrantes'},
      {field: 'uploadProject', header: 'Tema del caso'},
      {field: 'teacher', header: 'Tutor Asignado'},


    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedTutorAssignment.id)
            this.redirectEditForm(this.selectedTutorAssignment.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedTutorAssignment.id)
            this.remove(this.selectedTutorAssignment.id);
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/tutor-assignments', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/tutor-assignments', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.tutorAssignmentsHttpService.remove(id).subscribe((tutorAssignment) => {
            this.tutorAssignments = this.tutorAssignments.filter(item => item.id !== tutorAssignment.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.tutorAssignmentsHttpService.removeAll(this.selectedTutorAssignments).subscribe((tutorAssignments) => {
          this.selectedTutorAssignments.forEach(tutorAssignmentDeleted => {
            this.tutorAssignments = this.tutorAssignments.filter(tutorAssignment => tutorAssignment.id !== tutorAssignmentDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedTutorAssignments = [];
        });
      }
    });
  }

  selectTutorAssignment(tutorAssignment: TutorAssignmentModel) {
    this.selectedTutorAssignment = tutorAssignment;
  }

}
