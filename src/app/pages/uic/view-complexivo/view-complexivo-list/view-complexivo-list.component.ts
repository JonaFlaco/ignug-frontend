import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { AuthService } from '@services/auth';
import { SelectComplexivoDto, ComplexivoModel } from '@models/uic/complexivo.model';
import { ComplexivosHttpService } from '@services/uic/complexivo-http.service';
import { CourtProjectsHttpService } from '@services/uic/court-project-http.service';
import { CourtProjectModel } from '@models/uic';

@Component({
  selector: 'app-view-complexivo-list',
  templateUrl: './view-complexivo-list.component.html',
})
export class ViewComplexivoListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.complexivosHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedComplexivos: ComplexivoModel[] = [];
  selectedComplexivo: SelectComplexivoDto = {};
  complexivos: ComplexivoModel[] = [];
  courtProjects: CourtProjectModel[] = [];


  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private complexivosHttpService: ComplexivosHttpService,
    private courtProjectHttpService: CourtProjectsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Vista del proyecto y tutor asignado'}
    ]);
    this.columns = this.getColumns();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }


  findAll(page: number = 0) {
    this.courtProjectHttpService.findAll(page, this.search.value).subscribe((courtProjects) => this.courtProjects = courtProjects);
  }


  getColumns(): ColumnModel[] {
    return [
      {field: 'name', header: 'Estudiante'},
      {field: 'president', header: 'Presidente'},
      {field: 'vocal', header: 'Vocal 1'},
      {field: 'tutor', header: 'Vocal 2'},
      {field: 'proyect', header: 'Proyecto Asignado'},
      {field: 'place', header: 'Lugar de la defensa'},
      {field: 'defenseAt', header: 'Fecha de la defensa'},
    ]
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
