import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from "@angular/forms";
import { Router } from '@angular/router';
import { debounceTime } from "rxjs";
import { ColumnModel, PaginatorModel } from '@models/core';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { MenuItem} from "primeng/api";
import { AuthService } from '@services/auth';
import { SelectComplexivoDto, ComplexivoModel } from '@models/uic/complexivo.model';
import { ComplexivosHttpService } from '@services/uic/complexivo-http.service';

@Component({
  selector: 'app-complexivo-list',
  templateUrl: './complexivo-list.component.html',
})
export class ComplexivoListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.complexivosHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedComplexivos: ComplexivoModel[] = [];
  selectedComplexivo: SelectComplexivoDto = {};
  complexivos: ComplexivoModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private complexivosHttpService: ComplexivosHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Complexivos'}
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
    this.complexivosHttpService.findAll(page, this.search.value).subscribe((complexivos) => this.complexivos = complexivos);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'name2', header: 'Estudiante 2'},
      {field: 'name', header: 'Estudiante'},
      {field: 'president', header: 'Presidente'},
      {field: 'vocal', header: 'Vocal 1'},
      {field: 'tutor', header: 'Vocal 2'},
      {field: 'nameCase', header: 'Titulo del proyecto'}
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedComplexivo.id)
            this.redirectEditForm(this.selectedComplexivo.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedComplexivo.id)
            this.remove(this.selectedComplexivo.id);
        },
      },
    ];
  }

  paginate(complexivo: any) {
    this.findAll(complexivo.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/complexivo', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/complexivo', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.complexivosHttpService.remove(id).subscribe((complexivo) => {
            this.complexivos = this.complexivos.filter(item => item.id !== complexivo.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.complexivosHttpService.removeAll(this.selectedComplexivos).subscribe((complexivos) => {
          this.selectedComplexivos.forEach(complexivoDeleted => {
            this.complexivos = this.complexivos.filter(complexivo => complexivo.id !== complexivoDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedComplexivos = [];
        });
      }
    });
  }

  selectComplexivo(complexivo: ComplexivoModel) {
    this.selectedComplexivo = complexivo;
  }
}
