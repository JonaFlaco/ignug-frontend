import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, throwIfEmpty } from 'rxjs';
import { ColumnModel, PaginatorModel, StudentModel } from '@models/core';
import {
  BreadcrumbService,
  MessageService,
  StudentsHttpService,
} from '@services/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';
import { EnrollmentModel, TeacherModel } from '@models/uic';
import {
  EnrollmentsHttpService,
  HelpService,
  PlanningsHttpService,
} from '@services/uic';
import { TheoricalNotesHttpService } from '@services/uic/theoretical-note-http.service';
import {
  SelectTheoricalNoteDto,
  TheoricalNoteModel,
} from '@models/uic/theoretical-note.model';

@Component({
  selector: 'app-view-note-theorical-reprobed',
  templateUrl: './view-note-theorical-reprobed.component.html',
})
export class ViewNoteTheoricalReprobedComponent {
  id: string = '';
  bloodTypes: TheoricalNoteModel[] = [];
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.helpService.loaded$;
  checked: boolean = true;
  columns: ColumnModel[];
  //loaded$ = this.helpService.loaded$;
  pagination$ = this.enrollmentsHttpService.pagination$;
  paginator: PaginatorModel = this.helpService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedTheoricals: TheoricalNoteModel[] = [];
  selectedTheorical: TheoricalNoteModel = {
    id: '',
    name: undefined,
    note: 0,
    observations: '',
  };
  theoricals: TheoricalNoteModel[] = [];
  actionButtons: MenuItem[] = [];
  planning: string;
  prueba: TheoricalNoteModel[];
  form: any;

  constructor(
    public authService: AuthService,
    private helpService: HelpService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private enrollmentsHttpService: EnrollmentsHttpService,
    private planningsHttpService: PlanningsHttpService,
    private theoricalNotesHttpService: TheoricalNotesHttpService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.breadcrumbService.setItems([
      { label: 'Menú', routerLink: ['/uic/home-note'] },
      { label: 'Colocar Nota del Examén Teórico' },
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => (this.paginator = pagination));
    this.search.valueChanges
      .pipe(debounceTime(10))
      .subscribe((_) => this.findAll());
  }

  logoDataUrl: string;
  arriba: string;
  abajo: string;

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService
        .questionOnExit()
        .then((result) => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.findAll();
    this.findActive();
  }

  findAll(page: number = 0) {
    this.theoricalNotesHttpService
      .findAll(page, this.search.value)
      .subscribe(
        (theoricals) =>
          (this.theoricals = theoricals.filter(
            (theoricals) =>
            theoricals.name.student.career.id == this.authService.auth.teacher.career.id && theoricals.note <= 69
          ))
      );
  }

  getColumns(): ColumnModel[] {
    return [
      { field: 'identificationC', header: 'Cedúla' },
      { field: 'name', header: 'Estudiantes' },
      { field: 'note', header: 'Notas' },
    ];
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedTheorical.id)
            this.redirectEditForm(this.selectedTheorical.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedTheorical.id) this.remove(this.selectedTheorical.id);
        },
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/theorical-notes', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/theorical-notes', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.theoricalNotesHttpService.remove(id).subscribe((teacher) => {
          this.theoricals = this.theoricals.filter(
            (item) => item.id !== teacher.id
          );
          this.paginator.totalItems--;
        });
      }
    });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.theoricalNotesHttpService
          .removeAll(this.selectedTheoricals)
          .subscribe((theoricals) => {
            this.selectedTheoricals.forEach((theoricalDeleted) => {
              this.theoricals = this.theoricals.filter(
                (theorical) => theorical.id !== theoricalDeleted.id
              );
              this.paginator.totalItems--;
            });
            this.selectedTheoricals = [];
          });
      }
    });
  }

  selectTheorical(theorical: TheoricalNoteModel) {
    this.selectedTheorical = theorical;
  }

  findActive() {
    this.planningsHttpService.findActive().subscribe((planning) => {
      this.planning = planning.name;
    });
  }
}
