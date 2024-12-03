import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import { ModalitiesHttpService, PlanningsHttpService, AttendanceRecordHttpService } from '@services/uic';
import { CreateAttendanceRecordDto, RequirementModel, AttendanceRecordModel, UpdateAttendanceRecordDto, PlanningModel, ModalityModel, ReadPlanningDto } from '@models/uic';
import { ModalityTypeEnum, RequirementTypeEnum } from '@shared/enums';
import { PlanningTypeEnum } from '@shared/enums/planning.enum';
import { AttendanceRecordComponent } from '../attendance-record.component';
import { DateValidators } from '@shared/validators';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-attendance-record-form',
  templateUrl: './attendance-record-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AttendanceRecordFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  planning:ReadPlanningDto = {}
  bloodTypes: AttendanceRecordModel[] = [];
  namePlannings: PlanningModel[] = [];
  nameModality: ModalityModel[] = [];
  names: RequirementModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Subir Archivos Requeridos';
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;
  requirements: RequirementModel[];

  constructor(
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private attendanceRecordHttpService: AttendanceRecordHttpService,
    private modalitiesHttpService: ModalitiesHttpService,
    private planningsHttpService: PlanningsHttpService,
  ) {
    this.breadcrumbService.setItems([
      { label: 'Cargar Archivos Requisitos Requeridos', routerLink: ['/uic/attendance-record'] },
      { label: 'Formulario' },
    ]);
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Actualizar Cargar de Archivos';
    }
   }

   async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.loadNameModality();
    this.loadPlanningNames();
    this.getAttendanceRecord();
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
    name: [null, [Validators.required]],
    cedula: [null, [Validators.pattern('[0-9]+')]],
    registeredAt: [null, [DateValidators.min(new Date())]],
    namePlanning: [null, [Validators.required]],
    nameModality: [null, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.id != '') {
        this.update(this.form.value);
      } else {
        this.create(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields.then();
    }
  }

  create(AttendanceRecord: CreateAttendanceRecordDto): void {
    this.attendanceRecordHttpService.create(AttendanceRecord).subscribe(AttendanceRecord => {
      this.form.reset(AttendanceRecord);
      this.back();
    });
  }

  back(): void {
    this.router.navigate(['/uic/attendance-record']);
  }

  getAttendanceRecord(): void {
    this.isLoadingSkeleton = true;
    this.attendanceRecordHttpService.findOne(this.id).subscribe((attendanceRecord) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(attendanceRecord);
      // let date = format(new Date(tribunal.date), 'dd/MM/yyyy');
      // console.log (date);
    });
  }

  loadPlanningNames(): void {
    this.planningsHttpService.findAll().subscribe((namePlannings) => this.namePlannings = namePlannings);
  }

  loadNameModality(): void {
    this.modalitiesHttpService
      .modality(ModalityTypeEnum.UPLOAD_NAMES)
      .subscribe((nameModalities) => (this.nameModality = nameModalities.filter((modalities)=>modalities.state==true)));
  }

  update(attendanceRecord: UpdateAttendanceRecordDto): void {
    this.attendanceRecordHttpService
    .update(this.id, attendanceRecord)
    .subscribe((attendanceRecord) => {
      this.form.reset(attendanceRecord);
      this.back()
    });
  }
 }
