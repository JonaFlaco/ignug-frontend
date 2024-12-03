import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from "@angular/forms";
import { Router } from '@angular/router';
import { debounceTime } from "rxjs";
import { ColumnModel, PaginatorModel } from '@models/core';
import { PracticalCasesHttpService } from '@services/uic';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { MenuItem } from "primeng/api";
import { PracticalCaseModel, ReadPracticalCaseDto, SelectPracticalCaseDto } from '@models/uic';
import { AuthService } from '@services/auth';
import { RoleModel } from '@models/auth';

@Component({
  selector: 'app-practical-case-list',
  templateUrl: './practical-case-list.component.html',
})
export class PracticalCaseListComponent implements OnInit {

  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.practicalCasesHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedPracticalCases: PracticalCaseModel[] = [];
  selectedPracticalCase: SelectPracticalCaseDto = {};
  practicalCases: PracticalCaseModel[] = [];
  actionButtons: MenuItem[] = [];
  rol:RoleModel={};


  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private practicalCasesHttpService: PracticalCasesHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Casos Practicos'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());

    console.log(authService.roles);
    this.rol=authService.roles.find(role => role.code==='admin');
  }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(page: number = 0) {
    this.practicalCasesHttpService.findAll(page, this.search.value).subscribe((practicalCases) => this.practicalCases = practicalCases);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'proyect', header: 'Proyecto'},
      {field: 'startDate', header: 'Fecha inicio'},
      {field: 'endDate', header: 'Fecha fin'},
      {field: 'student', header: 'Estudiante'},
      {field: 'teacher', header: 'Profesor'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Calendario',
        icon: 'pi pi-calendar',
        command: () => {
          if (this.selectedPracticalCase.id)
            this.redirectTimelineFiltered(this.selectedPracticalCase.id);
        },
      },
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedPracticalCase.id)
            this.redirectEditForm(this.selectedPracticalCase.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedPracticalCase.id)
            this.remove(this.selectedPracticalCase.id);
        },
      },
    ];
  }

  paginate(practicalCase: any) {
    this.findAll(practicalCase.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/practical-cases', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/practical-cases', id]);
  }

  redirectTimeline() {
    this.router.navigate(['/uic/practical-cases/timeline']);
  }

  redirectTimelineFiltered(id: string){
    this.router.navigate(['/uic/practical-cases/timeline',id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.practicalCasesHttpService.remove(id).subscribe((practicalCase) => {
            this.practicalCases = this.practicalCases.filter(item => item.id !== practicalCase.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.practicalCasesHttpService.removeAll(this.selectedPracticalCases).subscribe((practicalCases) => {
          this.selectedPracticalCases.forEach(practicalCaseDeleted => {
            this.practicalCases = this.practicalCases.filter(practicalCase => practicalCase.id !== practicalCaseDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedPracticalCases = [];
        });
      }
    });
  }

  selectPracticalCase(practicalCase: ReadPracticalCaseDto) {
    this.practicalCasesHttpService.practicalCases = practicalCase
    this.selectedPracticalCase = practicalCase;
  }

}
