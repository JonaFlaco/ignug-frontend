import {Component, OnInit} from '@angular/core';
import {AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {AuthHttpService, AuthService} from '@services/auth';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import { RoutesService } from '@services/core/routes.service';
import { MemorandumComponent } from '../../memorandum/memorandum.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  planning:string;
  loaded$ = this.coreService.loaded$;
  logoDataUrl: string;
  editCalendar: string[] = [
    "admin", "teacher"
  ]
  viewCalendar: string[] = [
    "admin", "teacher", "student"
  ]
  memorandum: string[] = [
    "admin", "teacher"
  ]
  note: string[] = [
    "admin", "teacher"
  ]
  viewNote: string[] = [
    "student"
  ]
  pesos: string[] = [
    "admin", "teacher"
  ]

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
  ) {
    this.breadcrumbService.setItems([
      { label: 'Dashboard' },
    ]);
  }

  ngOnInit() {
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

  showViewNote():boolean{
    const isStudent = this.authService.roles.some(role => this.viewNote.some(calendar => calendar == role.code));
    return isStudent;
  }

  showNote():boolean{
    const isAdmin = this.authService.roles.some(role => this.note.some(calendar => calendar == role.code));
    return isAdmin;
  }

  showCalendar():boolean{
    const isCalendar = this.authService.roles.some(role => this.viewCalendar.some(calendar => calendar == role.code));
    return isCalendar;
  }

  showEditCalendar():boolean{
    const isCalendar = this.authService.roles.some(role => this.editCalendar.some(calendar => calendar == role.code));
    return isCalendar;
  }

  showMemorandum():boolean{
    const isMemorandum = this.authService.roles.some(role => this.memorandum.some(calendar => calendar == role.code));
    return isMemorandum;
  }

  showPesos():boolean{
    const isPesos = this.authService.roles.some(role => this.pesos.some(calendar => calendar == role.code));
    return isPesos;
  }
}
