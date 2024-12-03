import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { CareerModel, ColumnModel, PaginatorModel, SelectCareerDto } from '@models/core';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';
import { PlanningsHttpService } from '@services/uic';
import { CareersHttpService } from '@services/core/careers-http.service';
import { UserModel } from '@models/auth';

@Component({
  selector: 'app-home-career',
  templateUrl: './home-career.component.html',
  // styleUrls: ['./home-rubric-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeCareerComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.careersHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedCareers: CareerModel[] = [];
  selectedCareer: SelectCareerDto = {};
  actionButtons: MenuItem[] = [];
  logoDataUrl: string;
  planning:string;
  careers: CareerModel[] = [];


  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private careersHttpService: CareersHttpService,
    private planningsHttpService: PlanningsHttpService,
  ) {
    this.breadcrumbService.setItems([
      { label: 'Carreras' },
    ]);
    this.pagination$.subscribe((pagination) => (this.paginator = pagination));
    this.search.valueChanges
      .pipe(debounceTime(500))
      .subscribe((_) => this.findAll());
  }

  ngOnInit() {
    // this.findAll();
    this.checkRole();
    // this.findActive();
    // this.careers.push(this.authService.auth.teacher.career)
  }

  findAll(page: number = 0) {
    this.careersHttpService
      .findAll(page, this.search.value)
      .subscribe(
        (careers) =>
          {this.careers = careers}
      );
  }



  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectRubrics(career:CareerModel) {
    this.router.navigate(['/uic/rubrics/list',career.id]);

  }

  redirectCreateForm(careerId: CareerModel) {
    this.router.navigate(['/uic/rubrics','']);
    localStorage.setItem('career', JSON.stringify(careerId))
  }

  checkRole(){
    const isTeacher = this.authService.roles.some(role => role.code == 'teacher'|| 'rector');
    if(this.authService.auth.teacher && isTeacher){
      if(this.authService.auth.teacher.career) {

        this.careers.push(this.authService.auth.teacher.career)

      }

    }
    else{
      this.findAll();
    }
  }


  showRubric():boolean{
    const isTeacher = this.authService.roles.some(role => role.code == 'admin');
    return isTeacher;
  }

  showNote():boolean{
    const isTeacher = this.authService.roles.some(role => role.code == 'uic'||'coordinador_administrative');
    return isTeacher;
  }





  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.careersHttpService
          .removeAll(this.selectedCareers)
          .subscribe((careers) => {
            this.selectedCareers.forEach(
              (careerDeleted) => {
                this.careers = this.careers.filter(
                  (careers) =>
                  careers.id !== careerDeleted.id
                );
                this.paginator.totalItems--;
              }
            );
            this.selectedCareers = [];
          });
      }
    });
  }

  selectCareer(career: CareerModel) {
    this.selectedCareer = career;
  }



  // findActive () {
  //   this.planningsHttpService.findActive().subscribe(planning=>{
  //     this.planning = planning.name;
  //   })
  // }

}
