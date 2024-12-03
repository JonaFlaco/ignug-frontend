import {Component} from '@angular/core';
import {
  UntypedFormControl,

} from '@angular/forms';
import {Router} from '@angular/router';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {} from '@shared/interfaces';
import { PlanningsHttpService } from '@services/uic';
import { PrimeNGConfig, SelectItem, TreeNode } from 'primeng/api';
@Component({
  selector: 'app-menu-student',
  templateUrl: './menu-student.component.html',
  styleUrls: ['./menu-student.component.scss']
})
export class MenuStudentComponent {
  sortOptions: SelectItem[];
  sortOrder: number;
  sortField: string;
  id: string = '';
  panelHeader: string = 'Menu Estudiantes';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  nodes: TreeNode[];

  constructor(
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private planningsHttpService: PlanningsHttpService,
    )
    {{
    this.breadcrumbService.setItems([
      {label: 'Menu Estudiantes'}
    ]);
  }
  }

  direction(){
    this.router.navigate(["../event/event-list/event-list.component.html"]);
  }

  ngOnInit() {
  }
}
