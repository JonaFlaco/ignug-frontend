import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {ResponsibleTutorsHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { ResponsibleTutorModel, SelectResponsibleTutorDto } from '@models/uic';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-responsible-tutor-list',
  templateUrl: './responsible-tutor-list.component.html',
  styleUrls: ['./responsible-tutor-list.component.scss'],
})
export class ResponsibleTutorListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.responsibleTutorHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedResponsibleTutors: ResponsibleTutorModel[] = [];
  selectedResponsibleTutor: SelectResponsibleTutorDto = {};
  responsibleTutors: ResponsibleTutorModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private responsibleTutorHttpService: ResponsibleTutorsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'ResponsibleTutors'}
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
    this.responsibleTutorHttpService.findAll(page, this.search.value).subscribe((responsibleTutors) => this.responsibleTutors = responsibleTutors);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'nameStudent', header: 'Nombre '},
      {field: 'date', header: 'Fecha fin'},
      {field: 'approved', header: 'Estado'},
      {field: 'observation', header: 'Observación'},
      {field: 'score', header: 'Calificación'},

    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Revisar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedResponsibleTutor.id)
            this.redirectEditForm(this.selectedResponsibleTutor.id);
        },
      },
    ];
  }

  paginate(responsibleTutor: any) {
    this.findAll(responsibleTutor.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/responsible-tutors', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/responsible-tutors', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.responsibleTutorHttpService.remove(id).subscribe((responsibleTutor) => {
            this.responsibleTutors = this.responsibleTutors.filter(item => item.id !== responsibleTutor.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.responsibleTutorHttpService.removeAll(this.selectedResponsibleTutors).subscribe((responsibleTutors) => {
          this.selectedResponsibleTutors.forEach(responsibleTutorDeleted => {
            this.responsibleTutors = this.responsibleTutors.filter(responsibleTutor => responsibleTutor.id !== responsibleTutorDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedResponsibleTutors = [];
        });
      }
    });
  }

  selectResponsibleTutor(responsibleTutor: ResponsibleTutorModel) {
    this.selectedResponsibleTutor = responsibleTutor;
  }
}
