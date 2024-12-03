import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { AuthService } from '@services/auth';
import { SelectTeacherDto, TeacherModel } from '@models/core';
import { TeachersHttpService } from '@services/core/teacher-http.service';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
})
export class TeacherListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.teacherHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedTeachers: TeacherModel[] = [];
  selectedTeacher: SelectTeacherDto = {};
  teachers: TeacherModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private teacherHttpService: TeachersHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Teachers'}
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
    this.teacherHttpService.findAll(page, this.search.value).subscribe((teachers) => this.teachers = teachers);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'career', header: 'Carrera'},
      {field: 'name', header: 'Nombre'},


    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedTeacher.id)
            this.redirectEditForm(this.selectedTeacher.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedTeacher.id)
            this.remove(this.selectedTeacher.id);
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/core/teachers', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/core/teachers', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.teacherHttpService.remove(id).subscribe((teacher) => {
            this.teachers = this.teachers.filter(item => item.id !== teacher.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.teacherHttpService.removeAll(this.selectedTeachers).subscribe((teachers) => {
          this.selectedTeachers.forEach(teacherDeleted => {
            this.teachers = this.teachers.filter(teacher => teacher.id !== teacherDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedTeachers = [];
        });
      }
    });
  }

  selectTeacher(teacher: TeacherModel) {
    this.selectedTeacher = teacher;
  }
}
