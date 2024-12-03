import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService, CoreService } from '@services/core';
import { PracticalCasesHttpService } from '@services/uic';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReadPracticalCaseDto } from '@models/uic';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
})

export class TimelineComponent implements OnInit {
    practicalCase:ReadPracticalCaseDto={};
    checked: boolean = true;
    id: string = '';
    loaded$ = this.coreService.loaded$;
    panelHeader: string = 'CALENDARIO CASO PRACTICO';
    search: UntypedFormControl = new UntypedFormControl('')
    practicalCases: any [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private coreService: CoreService,
    private route: ActivatedRoute,
    private router: Router,
    private practicalCasesHttpService: PracticalCasesHttpService,

  ){
    if (this.activatedRoute.snapshot.params['id'] ) {
    this.breadcrumbService.setItems([
      {label: 'Casos Prácticos', routerLink: ['/uic/practical-cases']},
      {label: 'Línea de tiempo'}
    ]);}
    else{
      this.breadcrumbService.setItems([
        {label: 'Casos Prácticos', routerLink: ['/uic/practical-cases']},
        {label: 'Línea de tiempo', routerLink: ['/uic/practical-cases/timeline'] }
      ]);
    }
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'CRONOGRAMA';
    }
    this.practicalCase = practicalCasesHttpService.practicalCases


  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.params['id'] ) {
      const id = this.route.snapshot.paramMap.get('id');

        this.findByIdTimeline(0,id);
    }else{
      this.findTimeline();
    }
    
  }

  //Funcion Calendario
  findTimeline(page: number = 0, string = '') {
    const datePipe = new DatePipe('en-US');
    this.practicalCasesHttpService.findAll(page, this.search.value).subscribe((practicalCases) => {
      this.practicalCases = practicalCases.map(practicalCase => {
        const fechaInicio = datePipe.transform(practicalCase.startDate, 'dd/MM/yyyy');
        const fechaFin = datePipe.transform(practicalCase.endDate, 'dd/MM/yyyy');
        const tutor = practicalCase.teacher ? (practicalCase.teacher.name ? practicalCase.teacher.name : 'sin asignar') : 'sin asignar';
        const estudiante = practicalCase.student ? (practicalCase.student.name ? practicalCase.student.name : 'sin asignar') : 'sin asignar';
        
        const subheader = fechaInicio !== fechaFin
        ? `Fecha Inicio: ${fechaInicio} | Fecha Fin: ${fechaFin}`
        : 'Fechas: sin asignar';

        return {
          status: `${practicalCase.proyect}`,
          subheader: subheader,
          content: `Tutor al Cargo: ${tutor} `,
          content2: `Estudiante: ${estudiante}`
        };
      });
    });
  }

  //Metodo encontrar Timeline por id de caso practico

  findByIdTimeline(page: number = 0, id: string = '') {
    const datePipe = new DatePipe('en-US');
    this.practicalCasesHttpService.findByIdTimeline(page, this.search.value, id).subscribe((practicalCases) => {
      this.practicalCases = practicalCases.map(practicalCase => {
        const fechaInicio = datePipe.transform(practicalCase.startDate, 'dd/MM/yyyy');
        const fechaFin = datePipe.transform(practicalCase.endDate, 'dd/MM/yyyy');
        return {
          status: `${practicalCase.proyect}`,
          subheader: `Fecha Inicio: ${fechaInicio} | Fecha Fin: ${fechaFin}`,
          content: `Tutor al Cargo: ${practicalCase.teacher.name} `,
          content2:`Estudiante: ${practicalCase.student.name}`        };
      })
    });
  }

   //Funcion para el boton de regreso
    back(): void {
      this.router.navigate(['/uic/practical-cases']);
  }

}