import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { AuthService } from '@services/auth';
import { SelectStudentDegreeDto, StudentDegreeModel } from '@models/uic/student-degree.model';
import { StudentsDegreeHttpService } from '@services/uic/student-degree-http.service';

@Component({
  selector: 'app-student-degree-list',
  templateUrl: './student-degree-list.component.html',
  styleUrls: ['./student-degree-list.component.scss'],
})
export class StudentDegreeListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.studentsDegreeHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedStudentsDegree: StudentDegreeModel[] = [];
  selectedStudentDegree: SelectStudentDegreeDto = {};
  studentsDegree: StudentDegreeModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private studentsDegreeHttpService: StudentsDegreeHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'students-degree'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }


  checkState(event: StudentDegreeModel): string {
    if (event.state) return 'success';

  return 'danger';
  }


  findAll(page: number = 0) {
    this.studentsDegreeHttpService.findAll(page, this.search.value).subscribe((studentsDegree) => this.studentsDegree = studentsDegree);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'nameModality', header: 'Modalidad'},
      {field: 'namePlanning', header: 'Convocatoria'},
      {field: 'nameEstudiante', header: 'Estudiante'},
      {field: 'title', header: 'Titulo del proyecto'},
      {field: 'observation', header: 'observaciones'},
      //{field: 'observations', header: 'Observaciones'},
      {field: 'state', header: 'Estado'},
      {field: 'requerimientos', header: 'Requerimientos'},
      {field: 'file', header: 'Archivo'},

    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Update',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedStudentDegree.id)
            this.redirectEditForm(this.selectedStudentDegree.id);
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedStudentDegree.id)
            this.remove(this.selectedStudentDegree.id);
        },
      },
    ];
  }

  paginate(studentDegree: any) {
    this.findAll(studentDegree.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/students-degree', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/students-degree', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.studentsDegreeHttpService.remove(id).subscribe((studentDegree) => {
            this.studentsDegree = this.studentsDegree.filter(item => item.id !== studentDegree.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.studentsDegreeHttpService.removeAll(this.selectedStudentsDegree).subscribe((studentsDegree) => {
          this.selectedStudentsDegree.forEach(studentDegreeDeleted => {
            this.studentsDegree = this.studentsDegree.filter(studentDegree => studentDegree.id !== studentDegreeDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedStudentsDegree = [];
        });
      }
    });
  }

  selectStudentDegree(studentDegree: StudentDegreeModel) {
    this.selectedStudentDegree = studentDegree;
  }
}
