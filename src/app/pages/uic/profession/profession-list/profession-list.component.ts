import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {ProfessionsHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { ProfessionModel, SelectProfessionDto } from '@models/uic';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-profession-list',
  templateUrl: './profession-list.component.html',
  styleUrls: ['./profession-list.component.scss'],
})
export class ProfessionListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.professionsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedProfessions: ProfessionModel[] = [];
  selectedProfession: SelectProfessionDto = {};
  professions: ProfessionModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private professionsHttpService: ProfessionsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Professions'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }

  // checkState(profession: ProfessionModel): string {
  //   if (profession.isEnable) return 'success';

  // return 'danger';
  // }

  findAll(page: number = 0) {
    this.professionsHttpService.findAll(page, this.search.value).subscribe((professions) => this.professions = professions);
  }

  getColumns(): ColumnModel[] {
    return [
      // {field: 'sort', header: 'Orden'},
      {field: 'career', header: 'Carrera'},
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
          if (this.selectedProfession.id)
            this.redirectEditForm(this.selectedProfession.id);
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedProfession.id)
            this.remove(this.selectedProfession.id);
        },
      },
    ];
  }

  paginate(profession: any) {
    this.findAll(profession.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/professions', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/professions', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.professionsHttpService.remove(id).subscribe((profession) => {
            this.professions = this.professions.filter(item => item.id !== profession.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.professionsHttpService.removeAll(this.selectedProfessions).subscribe((professions) => {
          this.selectedProfessions.forEach(professionDeleted => {
            this.professions = this.professions.filter(profession => profession.id !== professionDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedProfessions = [];
        });
      }
    });
  }

  selectProfession(profession: ProfessionModel) {
    this.selectedProfession = profession;
  }
}
