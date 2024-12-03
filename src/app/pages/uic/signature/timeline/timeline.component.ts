import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService, CoreService } from '@services/core';
import { CataloguesHttpService, SignaturesHttpService, PreparationCoursesHttpService } from '@services/uic';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReadCatalogueDto, ReadSignatureDto, ReadPreparationCourseDto } from '@models/uic';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
})

export class TimelineComponent implements OnInit {
  catalogues:ReadCatalogueDto={}
  checked: boolean = true;
  signature:ReadSignatureDto = {}
  signatures: any[];
  id: string = '';
  loaded$ = this.coreService.loaded$;
  panelHeader: string = 'CALENDARIO DEL ESTUDIANTE';
  preparationCourse:ReadPreparationCourseDto = {}
  search: UntypedFormControl = new UntypedFormControl('')

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    private coreService: CoreService,
    private signaturesHttpService: SignaturesHttpService,
    private preparationCoursesHttpService: PreparationCoursesHttpService,
    private route: ActivatedRoute,
    private router: Router,

  ){
    this.breadcrumbService.setItems([
      {label: 'Curso de actualizacion', routerLink: ['/uic/preparation-courses']},
      {label: 'Línea de tiempo', routerLink: [''] }
    ]);
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'CRONOGRAMA';
    }
      this.signature = signaturesHttpService.signatures
      this.preparationCourse = preparationCoursesHttpService.preparationCourses
  }

  ngOnInit() {
      this.signatures = [

      ];
      const preparationCourseId = this.route.snapshot.paramMap.get('preparationCourseId');
      this.findByPreparationCourseTimeline(0, preparationCourseId);

      console.log(this.signature.signature.name);

  }

  //Datos buscados por un ID en especifico
    findByPreparationCourseTimeline(page: number = 0, preparationCourseId: string = '') {
  const datePipe = new DatePipe('en-US');
  this.signaturesHttpService.findByPreparationCourseTimeline(page, this.search.value, preparationCourseId).subscribe((signatures) => {
    this.signatures = signatures.map(signature => {
      const fechaInicio = datePipe.transform(signature.startDate, 'dd/MM/yyyy');
      const fechaFin = datePipe.transform(signature.endDate, 'dd/MM/yyyy');
      return {
        status: `Asigantura: ${signature.signature.name}`,
        subheader: `Inicia: ${fechaInicio} | Termina: ${fechaFin}`,
        content: `Horas: ${signature.hours}`,
        detail: `Descripcion del curso: ${this.preparationCourse.description}`,
        aDet:`Aprenderas a: ${signature.signature.description}`
      };
    })
  });
}

   //Funcion para el boton de regreso
    back(): void {
      this.router.navigate(['/uic/preparation-courses']);
  }
}
