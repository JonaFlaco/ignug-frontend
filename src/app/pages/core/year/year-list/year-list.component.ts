import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {YearsHttpService} from '@services/core';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { YearModel, SelectYearDto } from '@models/core';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-year-list',
  templateUrl: './year-list.component.html',
  styleUrls: ['./year-list.component.scss'],
})
export class YearListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.yearsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedYears: YearModel[] = [];
  selectedYear: SelectYearDto = {};
  years: YearModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private yearsHttpService: YearsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Years'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }

  // checkState(year: YearModel): string {
  //   if (year.isEnable) return 'success';

  // return 'danger';
  // }

  findAll(page: number = 0) {
    this.yearsHttpService.findAll(page, this.search.value).subscribe((years) => this.years = years);
  }

  getColumns(): ColumnModel[] {
    return [
      // {field: 'sort', header: 'Orden'},
      {field: 'year', header: 'Year'},
      // {field: 'planning', header: 'Convocatoria'},
      // {field: 'startDate', header: 'Fecha de inicio'},
      // {field: 'endDate', header: 'Fecha fin'},
      // {field: 'isEnable', header: 'Estado'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Update',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedYear.id)
            this.redirectEditForm(this.selectedYear.id);
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedYear.id)
            this.remove(this.selectedYear.id);
        },
      },
    ];
  }

  paginate(year: any) {
    this.findAll(year.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/core/years', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/core/years', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.yearsHttpService.remove(id).subscribe((year) => {
            this.years = this.years.filter(item => item.id !== year.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.yearsHttpService.removeAll(this.selectedYears).subscribe((years) => {
          this.selectedYears.forEach(yearDeleted => {
            this.years = this.years.filter(year => year.id !== yearDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedYears = [];
        });
      }
    });
  }

  selectYear(year: YearModel) {
    this.selectedYear = year;
  }
}
