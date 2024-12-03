import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {RegistersHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { RegisterModel, SelectRegisterDto } from '@models/uic';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-register-list',
  templateUrl: './register-list.component.html',
  styleUrls: ['./register-list.component.scss'],
})
export class RegisterListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.registersHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedRegisters: RegisterModel[] = [];
  selectedRegister: SelectRegisterDto = {};
  registers: RegisterModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private registersHttpService: RegistersHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Registros'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }


  findAll(page: number = 0) {
    this.registersHttpService.findAll(page, this.search.value).subscribe((registers) => this.registers = registers);
  }

  getColumns(): ColumnModel[] {
    return [
    {field: 'name', header: 'Registro'},
    {field: 'hours', header: 'Numero de horas'},
    //{field: 'tutor', header: 'Tutor'},
    {field: 'date', header: 'Fecha del registro'},
    //{field: 'endDate', header: 'Fecha de fin'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedRegister.id)
            this.redirectEditForm(this.selectedRegister.id);
        },
      },
      {
        label: 'Elminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedRegister.id)
            this.remove(this.selectedRegister.id);
        },
      },
    ];
  }

  paginate(register: any) {
    this.findAll(register.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/registers', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/registers', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.registersHttpService.remove(id).subscribe((register) => {
            this.registers = this.registers.filter(item => item.id !== register.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.registersHttpService.removeAll(this.selectedRegisters).subscribe((registers) => {
          this.selectedRegisters.forEach(registerDeleted => {
            this.registers = this.registers.filter(register => register.id !== registerDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedRegisters = [];
        });
      }
    });
  }

  selectRegister(register: RegisterModel) {
    this.selectedRegister = register;
  }
}
