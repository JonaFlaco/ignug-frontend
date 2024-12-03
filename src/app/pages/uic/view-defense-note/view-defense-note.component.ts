import {Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from '@services/core';
import { PlanningsHttpService } from '@services/uic';

@Component({
  selector: 'app-view-defense-note',
  templateUrl: './view-defense-note.component.html',
})
export class ViewDefenseNoteComponent {
  planning:string;

  constructor(
    private planningsHttpService: PlanningsHttpService,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
  )
  {
    this.breadcrumbService.setItems([
      { label: 'Notas de la Defensa' },
    ]);
  }

   redirectApproved() {
    const careerId = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/uic/defense-approved',careerId]);
  }


  redirectReproved() {
    const careerId = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/uic/defense-reproved',careerId]);
  }


  findActive () {
    this.planningsHttpService.findActive().subscribe(planning=>{
      this.planning = planning.name;
    })
  }
}
