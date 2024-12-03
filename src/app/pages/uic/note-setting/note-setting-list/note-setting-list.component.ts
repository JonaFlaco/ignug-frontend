import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ColumnModel, PaginatorModel } from '@models/core';
import { CoreService, MessageService, BreadcrumbService } from '@services/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';
import { NoteSettingModel, SelectNoteSettingDto } from '@models/uic';
import { NoteSettingsHttpService } from '@services/uic';

@Component({
  selector: 'app-note-setting-list',
  templateUrl: './note-setting-list.component.html',
})
export class NoteSettingListComponent implements OnInit {
  columns: ColumnModel[];
  loaded$ = this.coreService.loaded$;
  pagination$ = this.noteSettingsHttpService.pagination$;
  paginator: PaginatorModel = this.coreService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  noteSettings: NoteSettingModel[] = [];
  selectedNoteSettings: NoteSettingModel[] = [];
  selectedNoteSetting: SelectNoteSettingDto = {};
  actionButtons: MenuItem[] = [];
  form: UntypedFormGroup = this.newForm;
  finalCase:number=0;

  constructor(
    public authService: AuthService,
    private coreService: CoreService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private noteSettingsHttpService: NoteSettingsHttpService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,

  ) {
    this.breadcrumbService.setItems([{ label: 'Libro de configuración' }]);
    this.columns = this.getColumns();
    this.actionButtons = this.getActionButtons();
    this.pagination$.subscribe((pagination) => (this.paginator = pagination));
    this.search.valueChanges
      .pipe(debounceTime(500))
      .subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(page: number = 0) {
    this.noteSettingsHttpService
      .findAll(page, this.search.value)
      .subscribe((noteSettings) => (this.noteSettings = noteSettings));
  }

  getColumns(): ColumnModel[] {
    return [
      { field: 'student', header: 'Estudiantes' },
      { field: 'evaluation', header: 'Evaluación Continua' },
      { field: 'document', header: 'Documento' },
      { field: 'note', header: 'Nota Final' },
    ];
  }

  getActionButtons(): MenuItem[] {
    return [
      {
        label: 'Actualizar',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedNoteSetting.id)
            this.redirectEditForm(this.selectedNoteSetting.id);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedNoteSetting.id)
            this.remove(this.selectedNoteSetting.id);
        },
      },
    ];
  }

  showFinalNote(noteSetting:NoteSettingModel):number {
    const noteDocument = noteSetting.document * 0.5;
    const noteEvaluation = noteSetting.evaluation *0.5;
    let evaluation = noteDocument + noteEvaluation;
    return evaluation;
  }


  get noteField() {
    return this.form.controls['note'];
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      note: [null, [Validators.required]],
    });
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  redirectCreateForm() {
    this.router.navigate(['/uic/note-setting', 'new']);
  }

  redirectEditForm(id: string) {
    this.router.navigate(['/uic/note-setting', id]);
  }

  remove(id: string) {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.noteSettingsHttpService.remove(id).subscribe((noteSetting) => {
          this.noteSettings = this.noteSettings.filter(
            (item) => item.id !== noteSetting.id
          );
          this.paginator.totalItems--;
        });
      }
    });
  }

  removeAll() {
    this.messageService.questionDelete().then((result) => {
      if (result.isConfirmed) {
        this.noteSettingsHttpService
          .removeAll(this.selectedNoteSettings)
          .subscribe((noteSettings) => {
            this.selectedNoteSettings.forEach((noteSettingDeleted) => {
              this.noteSettings = this.noteSettings.filter(
                (noteSetting) => noteSetting.id !== noteSettingDeleted.id
              );
              this.paginator.totalItems--;
            });
            this.selectedNoteSettings = [];
          });
      }
    });
  }

  selectNoteSetting(noteSetting: NoteSettingModel) {
    this.selectedNoteSetting = noteSetting;
  }
}
