import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ColumnModel, PaginatorModel } from '@models/core';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';
import {
  EnrollmentModel,
  SelectEnrollmentDto,
} from '@models/uic/enrollment.model';
import { EnrollmentsHttpService } from '@services/uic/enrollment-http.service';
import { PlanningsHttpService } from '@services/uic';

@Component({
  selector: 'app-enrollment-list',
  templateUrl: './enrollment-list.component.html',
  styleUrls: ['./enrollment-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EnrollmentListComponent implements OnInit {
  columns: ColumnModel[];
  planning: string;
  loaded$ = this.coreService.loaded$;
  pagination$ = this.enrollmentsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedEnrollments: EnrollmentModel[] = [];
  selectedEnrollment: SelectEnrollmentDto = {};
  enrollments: EnrollmentModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private enrollmentsHttpService: EnrollmentsHttpService,
    private planningsHttpService: PlanningsHttpService
  ) {
    this.breadcrumbService.setItems([{ label: 'Inscripciones' }]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => (this.paginator = pagination));
    this.search.valueChanges
      .pipe(debounceTime(500))
      .subscribe((_) => this.findAll());
  }

  ngOnInit() {
    this.findAll();
    this.findActive();
  }

  findAll(page: number = 0) {
    this.enrollmentsHttpService
      .findAll(page, this.search.value)
      .subscribe((enrollments) => (this.enrollments = enrollments.filter(
        (enrollments) => enrollments.student.career.id == this.authService.auth.teacher.career.id)));
  }

  getColumns(): ColumnModel[] {
    return [
      // {field: 'Enrollmentname', header: 'Enrollmentname'},
      // {field: 'meshStudentId', header: 'MeshStudentId'},
      { field: 'student', header: 'Estudiante' },
      { field: 'code', header: 'Código' },
      // {field: 'observation', header: 'Observación'},
      { field: 'state', header: 'Estado' },
      { field: 'registeredAt', header: 'Fecha de registro' },
    ];
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedEnrollment.id)
            this.redirectEditForm(this.selectedEnrollment.id);
        },
      },
      // {
      //   label: 'Delete',
      //   icon: 'pi pi-trash',
      //   command: () => {
      //     if (this.selectedEnrollment.id)
      //       this.remove(this.selectedEnrollment.id);
      //   },
      // },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/enrollments', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/enrollments', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.enrollmentsHttpService.remove(id).subscribe((enrollment) => {
          this.enrollments = this.enrollments.filter(
            (item) => item.id !== enrollment.id
          );
          this.paginator.totalItems--;
        });
      }
    });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.enrollmentsHttpService
          .removeAll(this.selectedEnrollments)
          .subscribe((enrollments) => {
            this.selectedEnrollments.forEach((EnrollmentDeleted) => {
              this.enrollments = this.enrollments.filter(
                (enrollment) => enrollment.id !== EnrollmentDeleted.id
              );
              this.paginator.totalItems--;
            });
            this.selectedEnrollments = [];
          });
      }
    });
  }

  selectEnrollment(enrollment: EnrollmentModel) {
    this.selectedEnrollment = enrollment;
  }

  findActive() {
    this.planningsHttpService.findActive().subscribe((planning) => {
      this.planning = planning.name;
    });
  }
}
