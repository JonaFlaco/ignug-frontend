import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from "@angular/forms";
import { Router } from '@angular/router';
import { debounceTime } from "rxjs";
import { ColumnModel, PaginatorModel } from '@models/core';
import { PreparationCoursesHttpService } from '@services/uic';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { MenuItem } from "primeng/api";
import { PreparationCourseModel, ReadPreparationCourseDto, SelectPreparationCourseDto } from '@models/uic';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-preparation-course-list',
  templateUrl: './preparation-course-list.component.html',
})
export class PreparationCourseListComponent implements OnInit {

  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.preparationCoursesHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedPreparationCourses: PreparationCourseModel[] = [];
  selectedPreparationCourse: SelectPreparationCourseDto = {};
  preparationCourses: PreparationCourseModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private preparationCoursesHttpService: PreparationCoursesHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Administracion: Curso de Actualizacion'}
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
    this.preparationCoursesHttpService.findAll(page, this.search.value).subscribe((preparationCourses) => this.preparationCourses = preparationCourses);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'name', header: 'Nombre'},
      {field: 'startDate', header: 'Fecha inicio'},
      {field: 'endDate', header: 'Fecha fin'},
      {field: 'description', header: 'Descripción'},
      {field: 'planningName', header: 'Nombre Convocatoria'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedPreparationCourse.id)
            this.redirectEditForm(this.selectedPreparationCourse.id);
        },
      },
      {
        label: 'Linea de Tiempo',
        icon: 'pi pi-calendar',
        command: () => {
          if (this.selectedPreparationCourse.id)
            this.redirectTimeline(this.selectedPreparationCourse.id);
        },
      },
      {
        label: 'Agregar Asignaturas',
        icon: 'pi pi-apple',
        command: () => {
          if (this.selectedPreparationCourse.id)
          this.redirectSignature(this.selectedPreparationCourse.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedPreparationCourse.id)
            this.remove(this.selectedPreparationCourse.id);
        },
      },
    ];
  }

  paginate(preparationCourse: any) {
    this.findAll(preparationCourse.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/preparation-courses', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/preparation-courses', id]);
  }

  redirectSignature(preparationCourseId: string) {
    this.router.navigate(['/uic/signatures/preparationCourses',preparationCourseId]);
  }

  redirectTimeline(preparationCourseId:string) {
    this.router.navigate(['/uic/signatures/timeline',preparationCourseId]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.preparationCoursesHttpService.remove(id).subscribe((preparationCourse) => {
            this.preparationCourses = this.preparationCourses.filter(item => item.id !== preparationCourse.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.preparationCoursesHttpService.removeAll(this.selectedPreparationCourses).subscribe((preparationCourses) => {
          this.selectedPreparationCourses.forEach(preparationCourseDeleted => {
            this.preparationCourses = this.preparationCourses.filter(preparationCourse => preparationCourse.id !== preparationCourseDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedPreparationCourses = [];
        });
      }
    });
  }

  selectPreparationCourse(preparationCourse: ReadPreparationCourseDto) {
    this.preparationCoursesHttpService.preparationCourses = preparationCourse
    this.selectedPreparationCourse = preparationCourse;
  }

}
