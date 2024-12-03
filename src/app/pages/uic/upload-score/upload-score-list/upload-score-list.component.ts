import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {Router} from '@angular/router';
import {debounceTime} from "rxjs";
import {ColumnModel, PaginatorModel} from '@models/core';
import {UploadScoresHttpService} from '@services/uic';
import {BreadcrumbService, CoreService, MessageService, YearsHttpService} from '@services/core';
import {MenuItem} from "primeng/api";
import { UploadScoreModel, SelectUploadScoreDto } from '@models/uic';
import { AuthService } from '@services/auth';

@Component({
  selector: 'app-upload-score-list',
  templateUrl: './upload-score-list.component.html',
})
export class UploadScoreListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.uploadScoresHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedUploadScores: UploadScoreModel[] = [];
  selectedUploadScore: SelectUploadScoreDto = {};
  uploadScores: UploadScoreModel[] = [];
  actionButtons: MenuItem[] = [];

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private uploadScoresHttpService: UploadScoresHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Notas del examan practico'}
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
    this.uploadScoresHttpService.findAll(page, this.search.value).subscribe((uploadScores) => this.uploadScores = uploadScores);
  }

  getColumns(): ColumnModel[] {
    return [
      {field: 'name', header: 'Nombre'},
      {field: 'dni', header: 'Cédula'},
      {field: 'nameCareer', header: 'Carrera'},
      {field: 'score', header: 'Nota del Exámen Complexivo'},

    ]
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Update',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedUploadScore.id)
            this.redirectEditForm(this.selectedUploadScore.id);
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedUploadScore.id)
            this.remove(this.selectedUploadScore.id);
        },
      },
    ];
  }

  paginate(year: any) {
    this.findAll(year.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/upload-scores', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/upload-scores', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.uploadScoresHttpService.remove(id).subscribe((uploadScore) => {
            this.uploadScores = this.uploadScores.filter(item => item.id !== uploadScore.id);
            this.paginator.totalItems--;
          });
        }
      });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.uploadScoresHttpService.removeAll(this.selectedUploadScores).subscribe((uploadScores) => {
          this.selectedUploadScores.forEach(uploadScoreDeleted => {
            this.uploadScores = this.uploadScores.filter(uploadScore => uploadScore.id !== uploadScoreDeleted.id);
            this.paginator.totalItems--;
          });
          this.selectedUploadScores = [];
        });
      }
    });
  }

  selectUploadScore(uploadScore:UploadScoreModel) {
    this.selectedUploadScore = uploadScore;
  }
}
