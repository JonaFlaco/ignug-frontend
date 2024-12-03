import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { CareerModel, ColumnModel, PaginatorModel } from '@models/core';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';
import { RubricModel, SelectRubricDto } from '@models/uic';
import { PlanningsHttpService, RubricsHttpService } from '@services/uic';

@Component({
  selector: 'app-home-rubric',
  templateUrl: './home-rubric.component.html',
  // styleUrls: ['./home-rubric-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeRubricComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.rubricsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedRubrics: RubricModel[] = [];
  selectedRubric: SelectRubricDto = {};
  rubrics:RubricModel []= [];
  actionButtons: MenuItem[] = [];
  logoDataUrl: string;
  planning:string;
  careers: CareerModel[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private rubricsHttpService: RubricsHttpService,
    private planningsHttpService: PlanningsHttpService,
  ) {
    this.breadcrumbService.setItems([
      { label: 'Rubricas de Calificaciones' },
    ]);
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
    this.rubricsHttpService
      .findAll(page, this.search.value)
      .subscribe(
        (rubrics) =>
          (this.rubrics = rubrics)
      );
  }







  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Update',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedRubric.id)
            this.redirectEditForm(this.selectedRubric.id);
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedRubric.id)
            this.remove(this.selectedRubric.id);
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/rubrics', 'new']);
  }

  redirectCreateForme() {
    this.router.navigate(['/uic/rubrics', 'new']);
  }


  redirectEditForm(id: string) {
    this.router.navigate(['/uic/rubrics', id]);
  }

  redirectList(id:string){
    this.router.navigate(['/uic/rubrics/list',id]);
  }


  showItems(rubric:RubricModel){
    this.redirectList(rubric.id)

  }

  remove(id: string) {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.rubricsHttpService
          .remove(id)
          .subscribe((rubric) => {
            this.rubrics = this.rubrics.filter(
              (item) => item.id !== rubric.id
            );
            this.paginator.totalItems--;
          });
      }
    });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.rubricsHttpService
          .removeAll(this.selectedRubrics)
          .subscribe((rubrics) => {
            this.selectedRubrics.forEach(
              (rubricDeleted) => {
                this.rubrics = this.rubrics.filter(
                  (rubric) =>
                  rubric.id !== rubricDeleted.id
                );
                this.paginator.totalItems--;
              }
            );
            this.selectedRubrics = [];
          });
      }
    });
  }

  selectRubric(rubric: RubricModel) {
    this.selectedRubric = rubric;
  }

  findActive () {
    this.planningsHttpService.findActive().subscribe(planning=>{
      this.planning = planning.name;
    })
  }

}
