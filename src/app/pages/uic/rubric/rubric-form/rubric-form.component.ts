import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  FormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { CareerModel, ReadCareerDto, StudentModel } from '@models/core';
import { CreateRubricDto, ItemModel, RubricModel, UpdateRubricDto } from '@models/uic';
import {BreadcrumbService, CoreService, MessageService, StudentsHttpService} from '@services/core';
import { CareersHttpService } from '@services/core/careers-http.service';
import { ItemsHttpService, RubricsHttpService } from '@services/uic';
import { CatalogueTypeEnum } from '@shared/enums';
import {OnExitInterface} from '@shared/interfaces';
import { DuplicateValidators } from '@shared/validators/duplicate-validators';

@Component({
  selector: 'app-rubric-form',
  templateUrl:'./rubric-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class RubricFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: RubricModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Registrar rubica de calificaciones';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  checked: boolean = true;
  items:ItemModel[];
  item:ItemModel[]=[];
  careers: CareerModel[] = [];
  rubrics: RubricModel[] = [];
  search: UntypedFormControl = new UntypedFormControl('');
  career:ReadCareerDto = {}
  filteredOptions: ItemModel[];
  nameStudents:StudentModel[];
  nameStudent:StudentModel[]=[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private rubricsHttpService: RubricsHttpService,
    private itemsHttpService: ItemsHttpService,
    private careersHttpService: CareersHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private studentsHttpService: StudentsHttpService,

  ) {
    this.breadcrumbService.setItems([
      {label: 'Rubricas', routerLink: ['/uic/rubrics']},
      {label: 'Formularios'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Formulario';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.getStudent();
    this.getItem();
    this.getCareer();
    this.itemsHttpService.findEverything().subscribe((data) => {
      this.items = data;
      this.filterOptions();

    });
    if(this.id){
      this.getRubric();
    }

    this.career = JSON.parse(localStorage.getItem('career'));
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      item: [null, [Validators.required]],
      criterio: [null, [Validators.required]],
      criterio2: [null, [Validators.required]],
      criterio3: [null, [Validators.required]],
      criterio4: [null, [Validators.required]],
      criterio5: [null, [Validators.required]],
    });
  }

  filterOptions(): void {
    this.filteredOptions = this.items.filter((option) => {
      return option.career.name === this.career.name && option.state == true;

    });

  }
  getRubrics(page: number = 0,careerId:string=`${this.careersHttpService.careers.id}`):void{
    this.rubricsHttpService. findByCareer(page,this.search.value,careerId).subscribe(rubrics =>{
      this.rubrics =rubrics;
    })
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.id != '') {
        this.update(this.form.value);
      } else {
        this.form.value.career = JSON.parse(localStorage.getItem('career'))
        this.create(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields.then();
    }
  }


  back(): void {
    const career = JSON.parse(localStorage.getItem('career'));
    this.router.navigate(['/uic/rubrics/list',career.id]);
  }

  create(rubric: CreateRubricDto): void {
    this.rubricsHttpService.create(rubric).subscribe(rubric => {
      this.form.reset(rubric);
      this.back();
      localStorage.removeItem('career')
    });
  }

  getItem(): void {
    this.isLoadingSkeleton = true;
    this.itemsHttpService.item(CatalogueTypeEnum.RUBRIC_NAMES).subscribe((item) => {
      this.isLoadingSkeleton = false;
      this.item = item;
    });
  }

  getStudent(): void {
    this.isLoadingSkeleton = true;
    this.studentsHttpService.nameStudent(CatalogueTypeEnum.STUDENT).subscribe((nameStudent) => {
      this.isLoadingSkeleton = false;
      this.nameStudent = nameStudent;
    });
  }


  getRubric(): void {
    this.isLoadingSkeleton = true;
    this.rubricsHttpService.findOne(this.id).subscribe((rubric) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(rubric);
    });
  }

  update(rubric: UpdateRubricDto): void {
    this.rubricsHttpService.update(this.id, rubric).subscribe((rubric) => {
      this.form.reset(rubric);
      this.back()
    });
  }


  getCareer(): void {
    this.isLoadingSkeleton = true;
    this.careersHttpService.career(CatalogueTypeEnum.CAREER).subscribe((careers) => {
      this.isLoadingSkeleton = false;
      this.careers = careers;
    });
  }

  // Getters
  get idField() {
    return this.form.controls['id'];
  }

  get itemField(): FormArray {
    return this.form.controls['item'] as FormArray;
  }

  get criterioField() {
    return this.form.controls['criterio'];
  }

  get criterio2Field() {
    return this.form.controls['criterio2'];
  }

  get criterio3Field() {
    return this.form.controls['criterio3'];
  }

  get criterio4Field() {
    return this.form.controls['criterio4'];
  }

  get criterio5Field() {
    return this.form.controls['criterio5'];
  }




}
