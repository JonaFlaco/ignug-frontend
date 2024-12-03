import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {MeshStudentRequirementsHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { MeshStudentRequirementModel, SelectMeshStudentRequirementDto } from '@models/uic';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-mesh-student-requirement-list',
  templateUrl: './mesh-student-requirement-list.component.html',
  styleUrls: ['./mesh-student-requirement-list.component.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class MeshStudentRequirementListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.meshStudentRequirementsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedMeshStudentRequirements: MeshStudentRequirementModel[] = [];
  selectedMeshStudentRequirement: SelectMeshStudentRequirementDto = {};
  meshStudentRequirements: MeshStudentRequirementModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private meshStudentRequirementsHttpService: MeshStudentRequirementsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Requerimiento del Estudiante'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit() {
    this.findAll();
  }

  checkState(meshStudentRequirement: MeshStudentRequirementModel): string {
    if (meshStudentRequirement.approved) return 'success';

    return 'danger';
  }

  findAll(page: number = 0) {
    this.meshStudentRequirementsHttpService.findAll(page, this.search.value).subscribe((meshStudentRequirements) => this.meshStudentRequirements = meshStudentRequirements);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'requirement', header: 'Requerimentos'},
      {field: 'observations', header: 'Observación'},
      {field: 'approved', header: 'Aprobado'},

      //{field: 'meshStudent', header: 'meshStudent'},
      //{field: 'name', header: 'Requerimiento'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Update',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedMeshStudentRequirement.id)
            this.redirectEditForm(this.selectedMeshStudentRequirement.id);
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedMeshStudentRequirement.id)
            this.remove(this.selectedMeshStudentRequirement.id);
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/mesh-student-requirements', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/mesh-student-requirements', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.meshStudentRequirementsHttpService.remove(id).subscribe((meshStudentRequirement) => {
            this.meshStudentRequirements = this.meshStudentRequirements.filter(item => item.id !== meshStudentRequirement.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.meshStudentRequirementsHttpService.removeAll(this.selectedMeshStudentRequirements).subscribe((meshStudentRequirements) => {
          this.selectedMeshStudentRequirements.forEach(meshStudentRequirementDeleted => {
            this.meshStudentRequirements = this.meshStudentRequirements.filter(meshStudentRequirement => meshStudentRequirement.id !== meshStudentRequirementDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedMeshStudentRequirements = [];
        });
      }
    });
  }

  selectMeshStudentRequirement(meshStudentRequirement: MeshStudentRequirementModel) {
    this.selectedMeshStudentRequirement = meshStudentRequirement;
  }
}
