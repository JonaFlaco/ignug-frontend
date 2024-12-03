import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ColumnModel, PaginatorModel } from '@models/core';
import { ModalitiesHttpService, PlanningsHttpService, StudentInformationsHttpService } from '@services/uic';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { MenuItem } from 'primeng/api';
import {
  ReadPlanningDto,
  SelectStudentInformationDto,
  StudentInformationModel,
} from '@models/uic';
import { AuthService } from '@services/auth';
import { ModalityModel, ReadModalityDto, SelectModalityDto } from '../../../../models/uic/modality.model';

@Component({
  selector: 'app-home-student',
  templateUrl: './home-student.component.html',
  //styleUrls: ['./student-information-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeStudentComponent implements OnInit {
  modalities: ModalityModel[] = [];
  selectedModality: SelectModalityDto = {};
  planning:string;
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.studentInformationsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedStudentInformations: StudentInformationModel[] = [];
  selectedStudentInformation: SelectStudentInformationDto = {};
  studentInformations: StudentInformationModel[] = [];
  actionButtons: MenuItem[] = [];
  logoDataUrl: string;

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private studentInformationsHttpService: StudentInformationsHttpService,
    private planningsHttpService: PlanningsHttpService,
    private modalitiesHttpService: ModalitiesHttpService,
  ) {
    this.breadcrumbService.setItems([
      { label: 'Inicio Estudiante' },
    ]);
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => (this.paginator = pagination));
    this.search.valueChanges
      .pipe(debounceTime(500))
      .subscribe((_) => this.findAll());
  }

  ngOnInit() {
    this.findActive();
    this.findAllModality();
  }

  // checkState(studentInformation: StudentInformationModel): string {
  //   if (studentInformation.status) return 'danger';

  //   return 'success';
  // }

  findAll(page: number = 0) {
    this.studentInformationsHttpService
      .findAll(page, this.search.value)
      .subscribe(
        (studentInformations) =>
          (this.studentInformations = studentInformations)
      );
  }

  findAllModality(page: number = 0) {
    this.modalitiesHttpService
    .findAll(page, this.search.value)
    .subscribe((modalities) => this.modalities = modalities.filter((modalities)=>modalities.state==true));
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Update',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedStudentInformation.id)
            this.redirectEditForm(this.selectedStudentInformation.id);
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedStudentInformation.id)
            this.remove(this.selectedStudentInformation.id);
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/student-informations', 'new']);
  }

  redirectCreateForme() {
    this.router.navigate(['/uic/student-informations/complexivo', 'new']);
  }


  redirectEditForm(id: string) {
    this.router.navigate(['/uic/student-informations', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.studentInformationsHttpService
          .remove(id)
          .subscribe((studentInformation) => {
            this.studentInformations = this.studentInformations.filter(
              (item) => item.id !== studentInformation.id
            );
            this.paginator.totalItems--;
          });
      }
    });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.studentInformationsHttpService
          .removeAll(this.selectedStudentInformations)
          .subscribe((studentInformations) => {
            this.selectedStudentInformations.forEach(
              (studentInformationDeleted) => {
                this.studentInformations = this.studentInformations.filter(
                  (studentInformation) =>
                    studentInformation.id !== studentInformationDeleted.id
                );
                this.paginator.totalItems--;
              }
            );
            this.selectedStudentInformations = [];
          });
      }
    });
  }

  selectStudentInformation(studentInformation: StudentInformationModel) {
    this.selectedStudentInformation = studentInformation;
  }

  selectModality(modality: ModalityModel) {
    this.selectedModality = modality;
    this.redirectCreateForm();
  }

  findActive () {
    this.planningsHttpService.findActive().subscribe(planning=>{
      this.planning = planning.name;
    })
  }
}
