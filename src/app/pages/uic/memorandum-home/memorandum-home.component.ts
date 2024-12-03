import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth';
import { BreadcrumbService } from '@services/core';
import { PlanningsHttpService } from '@services/uic';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-memorandum-home',
  templateUrl: './memorandum-home.component.html',
  styleUrls: ['./memorandum-home.component.scss'],
})
export class MemorandumHomeComponent {
  actionButtons: MenuItem[] = [];

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    public authService: AuthService,
  )
  {
    this.breadcrumbService.setItems([
      { label: 'Inicio Memorandos' },
    ]);
  }

  splitButtonModel: MenuItem[] = [
    {
      label: 'Aplicador del examen teórico',
      icon: 'pi pi-arrow-right',
      command: () => {
        this.redirectExamForm();
      }
    },
    {
      label: 'Tutor Caso práctico',
      icon: 'pi pi-arrow-right',
      command: () => {
        this.redirectTutorForm();
      }
    },
  ];

  redirectExamForm() {
    this.router.navigate(['/uic/memorandums', 'new']);
  }
  redirectTutorForm() {
    this.router.navigate(['/uic/memorandums/tutor','new']);
  }

  redirectExamList() {
    this.router.navigate(['/uic/memorandums']);
  }

  redirectTutorList() {
    this.router.navigate(['/uic/memorandums/list']);
  }


}
