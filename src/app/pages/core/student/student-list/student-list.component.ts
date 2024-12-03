import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ColumnModel, PaginatorModel } from '@models/core';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';
import { SelectStudentDto, StudentModel } from '@models/core';
import { StudentsHttpService } from '@services/core';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
})
export class StudentListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.studentHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedStudents: StudentModel[] = [];
  selectedStudent: SelectStudentDto = {};
  students: StudentModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private studentHttpService: StudentsHttpService
  ) {
    this.breadcrumbService.setItems([{ label: 'Students' }]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => (this.paginator = pagination));
    this.search.valueChanges
      .pipe(debounceTime(500))
      .subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(page: number = 0) {
    this.studentHttpService
      .findAll(page, this.search.value)
      .subscribe((students) => (this.students = students));
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'identification_card', header: 'Cédula'},
      {field: 'name', header: 'Nombre'},
      {field: 'career', header: 'Correo'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedStudent.id)
            this.redirectEditForm(this.selectedStudent.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedStudent.id) this.remove(this.selectedStudent.id);
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/core/students', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/core/students', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.studentHttpService.remove(id).subscribe((student) => {
          this.students = this.students.filter(
            (item) => item.id !== student.id
          );
          this.paginator.totalItems--;
        });
      }
    });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.studentHttpService
          .removeAll(this.selectedStudents)
          .subscribe((students) => {
            this.selectedStudents.forEach((studentDeleted) => {
              this.students = this.students.filter(
                (student) => student.id !== studentDeleted.id
              );
              this.paginator.totalItems--;
            });
            this.selectedStudents = [];
          });
      }
    });
  }

  selectStudent(student: StudentModel) {
    this.selectedStudent = student;
  }
}
