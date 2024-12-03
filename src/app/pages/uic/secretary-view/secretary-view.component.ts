import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import {
  CareerModel,
  ColumnModel,
  PaginatorModel,
  SelectCareerDto,
} from '@models/core';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';
import { CareersHttpService } from '@services/core/careers-http.service';

@Component({
  selector: 'app-secretary-view',
  templateUrl: './secretary-view.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SecretaryViewComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.careersHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedCareers: CareerModel[] = [];
  selectedCareer: SelectCareerDto = {};
  actionButtons: MenuItem[] = [];
  logoDataUrl: string;
  planning: string;
  careers: CareerModel[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private careersHttpService: CareersHttpService,
    private route: ActivatedRoute
  ) {
    this.breadcrumbService.setItems([{ label: 'Carreras' }]);
    this.pagination$.subscribe((pagination) => (this.paginator = pagination));
    this.search.valueChanges
      .pipe(debounceTime(500))
      .subscribe((_) => this.findAll());
  }

  ngOnInit() {
    this.findAll();
  }

  findAll(page: number = 0) {
    this.careersHttpService
      .findAll(page, this.search.value)
      .subscribe((careers) => {
        this.careers = careers;
      });
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectViewNote(career: CareerModel) {
    this.router.navigate(['/uic/view-defense-note', career.id]);
  }

  selectCareer(career: CareerModel) {
    this.selectedCareer = career;
  }
}
