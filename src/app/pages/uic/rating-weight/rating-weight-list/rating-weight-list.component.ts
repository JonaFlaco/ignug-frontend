import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {BreadcrumbService, CoreService, MessageService} from '@services/core';
import {MenuItem} from "primeng/api";
import { AuthService } from '@services/auth';
import { SelectRatingWeightDto, RatingWeightModel } from '@models/uic';
import { RatingWeightsHttpService } from '@services/uic';

@Component({
  selector: 'app-rating-weight-list',
  templateUrl: './rating-weight-list.component.html',
})
export class RatingWeightListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.ratingWeightHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedRatingWeights: RatingWeightModel[] = [];
  selectedRatingWeight: SelectRatingWeightDto = {};
  ratingWeights: RatingWeightModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private ratingWeightHttpService: RatingWeightsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Pesos de calificaciones'}
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
    this.ratingWeightHttpService.findAll(page, this.search.value).subscribe((ratingWeights) => this.ratingWeights = ratingWeights);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'weightOne', header: 'Examen Teórico'},
      {field: 'weightTwo', header: 'Examen Prático'},

    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedRatingWeight.id)
            this.redirectEditForm(this.selectedRatingWeight.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedRatingWeight.id && this.ratingWeights.length > 1)
            this.remove(this.selectedRatingWeight.id);
        },
        disabled: !this.selectedRatingWeight.id || this.ratingWeights.length === 1,
      },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    if (this.ratingWeights.length === 0) {
      this.router.navigate(['/uic/rating-weights', 'new']);
    }
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/rating-weights', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.ratingWeightHttpService.remove(id).subscribe((ratingWeight) => {
            this.ratingWeights = this.ratingWeights.filter(item => item.id !== ratingWeight.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.ratingWeightHttpService.removeAll(this.selectedRatingWeights).subscribe((ratingWeights) => {
          this.selectedRatingWeights.forEach(ratingWeightDeleted => {
            this.ratingWeights = this.ratingWeights.filter(ratingWeight => ratingWeight.id !== ratingWeightDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedRatingWeights = [];
        });
      }
    });
  }

  selectRatingWeight(ratingWeight: RatingWeightModel) {
    this.selectedRatingWeight = ratingWeight;
  }
}
