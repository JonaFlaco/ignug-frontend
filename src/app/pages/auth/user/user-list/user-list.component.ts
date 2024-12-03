import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {SelectUserDto, UserModel} from '@models/auth';
import {ColumnModel, PaginatorModel} from '@models/core';
import {AuthService, UsersHttpService} from '@services/auth';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.usersHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedUsers: UserModel[] = [];
  selectedUser: SelectUserDto = {};
  users: UserModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private usersHttpService: UsersHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Users'}
    ]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => this.paginator = pagination);
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((_) => this.findAll());
  }

  ngOnInit() {
    this.findAll();
  }

  checkState(user: UserModel): string {
    if (user.suspendedAt) return 'danger';

    if (user.maxAttempts === 0) return 'warning';

    return 'success';
  }

  findAll(page: number = 0) {
    this.usersHttpService.findAllNew(page, this.search.value).subscribe((users) => this.users = users);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'username', header: 'Username'},
      {field: 'name', header: 'Name'},
      {field: 'lastname', header: 'Lastname'},
      {field: 'email', header: 'Email'},
      {field: 'roles', header: 'Roles'},
      {field: 'suspendedAt', header: 'State'},
    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Update',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedUser.id)
            this.redirectEditForm(this.selectedUser.id);
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedUser.id)
            this.remove(this.selectedUser.id);
        },
      },
      {
        label: 'Suspend',
        icon: 'pi pi-lock',
        command: () => {
          if (this.selectedUser.id)
            this.suspend(this.selectedUser.id);
        },
      },
      {
        label: 'Reactivate',
        icon: 'pi pi-lock-open',
        command: () => {
          if (this.selectedUser.id)
            this.reactivate(this.selectedUser.id);
        },
      }
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/administration/users', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/administration/users', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.usersHttpService.remove(id).subscribe((user) => {
            this.users = this.users.filter(item => item.id !== user.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.usersHttpService.removeAll(this.selectedUsers).subscribe((users) => {
          this.selectedUsers.forEach(userDeleted => {
            this.users = this.users.filter(user => user.id !== userDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedUsers = [];
        });
      }
    });
  }

  selectUser(user: UserModel) {
    this.selectedUser = user;
  }

  suspend(id: string) {
    this.usersHttpService.suspend(id).subscribe(user => {
      const index = this.users.findIndex(user => user.id === id);
      this.users[index].suspendedAt = user.suspendedAt;
    });
  }

  reactivate(id: string) {
    this.usersHttpService.reactivate(id).subscribe(user => {
      const index = this.users.findIndex(user => user.id === id);
      this.users[index] = user;
    });
  }
}
