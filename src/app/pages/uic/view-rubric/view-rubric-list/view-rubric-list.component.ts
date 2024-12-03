import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { AuthService } from '@services/auth';
import { RubricModel, SelectRubricDto } from '@models/uic';
import { RubricsHttpService } from '@services/uic';

@Component({
  selector: 'app-view-rubric-list',
  templateUrl: './view-rubric-list.component.html',
})
export class ViewRubricListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.rubricsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedRubrics: RubricModel[] = [];
  selectedRubric: SelectRubricDto = {};
  rubrics: RubricModel[] = [];


  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private rubricsHttpService: RubricsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Rubricas'}
    ]);
    this.columns = this.getColumns();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(page: number = 0) {
    this.rubricsHttpService.findAll(page, this.search.value).subscribe((rubrics) => this.rubrics = rubrics);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'items', header: 'Items'},
      {field: 'criterio1', header: 'Criterio 1 de Calificación'},
      {field: 'criterio2', header: 'Criterio 2 de Calificación'},
      {field: 'criterio3', header: 'Criterio 3 de Calificación'},
      {field: 'criterio4', header: 'Criterio 4 de Calificación'},
      {field: 'criterio5', header: 'Criterio 5 de Calificación'},


    ]
  }



  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/rubrics','new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/rubrics', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.rubricsHttpService.remove(id).subscribe((rubric) => {
            this.rubrics = this.rubrics.filter(item => item.id !== rubric.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.rubricsHttpService.removeAll(this.selectedRubrics).subscribe((rubrics) => {
          this.selectedRubrics.forEach(rubricDeleted => {
            this.rubrics = this.rubrics.filter(rubric => rubric.id !== rubricDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedRubrics = [];
        });
      }
    });
  }

  selectRubric(rubric: RubricModel) {
    this.selectedRubric = rubric;
  }
}
