import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth';
import { BreadcrumbService } from '@services/core';
import { PlanningsHttpService } from '@services/uic';

@Component({
  selector: 'app-home-note',
  templateUrl: './home-note.component.html',
  styleUrls: ['./home-note.component.scss']
})
export class HomeNoteComponent {
  planning:string;

  constructor(
    private planningsHttpService: PlanningsHttpService,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    public authService: AuthService,
  )
  {
    this.breadcrumbService.setItems([
      { label: 'Inicio Estudiante' },
    ]);
  }

  redirectReprobed() {
    this.router.navigate(['/uic/view-note-reprobed']);
  }

  redirectAprobed() {
    this.router.navigate(['/uic/view-note']);
  }

  findActive () {
    this.planningsHttpService.findActive().subscribe(planning=>{
      this.planning = planning.name;
    })
  }
}
