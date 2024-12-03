import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import {ProjectBenchModel, SelectProjectBenchDto } from '@models/uic';
import { AuthService } from '@services/auth';
import { ProjectBenchsHttpService } from '@services/uic';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-project-bench-list',
  templateUrl: './project-bench-list.component.html',
  styleUrls: ['./project-bench-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectBenchListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.projectBenchsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedProjectBenchs: ProjectBenchModel[] = [];
  selectedProjectBench: SelectProjectBenchDto = {};
  projectBenchs: ProjectBenchModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private projectBenchsHttpService: ProjectBenchsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Bancos del proyecto'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit() {
    this.findAll();
  }

  checkState(projectBench: ProjectBenchModel): string {
    if (projectBench.state) return 'success';

    return 'danger';
  }

  findAll(page: number = 0) {
    this.projectBenchsHttpService.findAll(page, this.search.value).subscribe((projectBenchs) => this.projectBenchs = projectBenchs);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'teacher', header: 'Tutor Asignado'},
      {field: 'name', header: 'Nombre del Proyecto'},
      {field: 'title', header: 'Sub-Modulos'},
      {field: 'description', header: 'Descripción del Proyecto'},
      { field: 'startDate', header: 'Fecha Inico' },
      { field: 'endDate', header: 'Fecha Fin' },
      {field: 'state', header: 'Estado'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Asignaciones',
        icon: 'pi pi-check',

        command: () => {
            this.redirectAsig();
        },

      },
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedProjectBench.id)
            this.redirectEditForm(this.selectedProjectBench.id);
        },
      },
      {
        label: 'Descargar Lista',
        icon: 'pi pi-download',
        command: () => {
          if (this.selectedProjectBench.id)
            this.createPDF();
       },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedProjectBench.id)
            this.remove(this.selectedProjectBench.id);
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectAsig(id: string='') {
    this.router.navigate(['/uic/notes', 'new']);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/project-benchs', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/project-benchs', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.projectBenchsHttpService.remove(id).subscribe((projectBench) => {
            this.projectBenchs = this.projectBenchs.filter(item => item.id !== projectBench.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.projectBenchsHttpService.removeAll(this.selectedProjectBenchs).subscribe((projectBenchs) => {
          this.selectedProjectBenchs.forEach(projectBenchDeleted => {
            this.projectBenchs = this.projectBenchs.filter(projectBench => projectBench.id !== projectBenchDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedProjectBenchs = [];
        });
      }
    });
  }

  selectProjectBench(projectBench: ProjectBenchModel) {
    this.selectedProjectBench = projectBench;
  }

  createPDF(){
    const pdfDefinition: any = {
      content: [
        {
          text: 'FELICIDADES LISTA DESCARGADA'
        }
      ]
    }

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.download();
  }
}
