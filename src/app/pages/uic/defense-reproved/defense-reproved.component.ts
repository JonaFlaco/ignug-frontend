import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ColumnModel, PaginatorModel, StudentModel } from '@models/core';
import { BreadcrumbService, MessageService } from '@services/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@services/auth';
import {
  HelpService,
  PlanningsHttpService,
  RubricsHttpService,
} from '@services/uic';
import {
  // NoteDefenseModel,
  RubricNoteModel,
  SelectRubricNoteDto,
} from '@models/uic/rubric-note.model';
import { RubricNotesHttpService } from '@services/uic/rubric-note-http.service';
import { NoteDefenseModel, SelectNoteDefenseDto } from '@models/uic';

@Component({
  selector: 'app-defense-reproved',
  templateUrl: './defense-reproved.component.html',
})
export class DefenseReprovedComponent {
  id: string = '';
  bloodTypes: NoteDefenseModel[] = [];
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.helpService.loaded$;
  columns: ColumnModel[];
  pagination$ = this.rubricNotesHttpService.pagination$;
  paginator: PaginatorModel = this.helpService.paginator;
  search: UntypedFormControl = new UntypedFormControl('');
  selectedNoteDefenses: NoteDefenseModel[] = [];
  selectedNoteDefense: SelectNoteDefenseDto = {
    nameStudent: {
      id: '',
      name: '',
      user: null,
      career: {
        id: '',
        name: '',
        degree: '',
      },
      identification_card: 1,
      note:null,
    },
    score: 0,
  };
  noteDefenses: NoteDefenseModel[] = [];
  rubricNotes: RubricNoteModel[] = [];
  actionButtons: MenuItem[] = [];
  form: any;

  constructor(
    public authService: AuthService,
    private helpService: HelpService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
    private router: Router,
    private rubricNotesHttpService: RubricNotesHttpService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
  ) {
    this.breadcrumbService.setItems([{ label: 'Nota del Examén Práctico' }]);
    this.columns = this.getColumns();
    this.pagination$.subscribe((pagination) => (this.paginator = pagination));
    this.search.valueChanges
      .pipe(debounceTime(10))
      .subscribe((_) => this.findAll());
  }

  ngOnInit(): void {
    // Obtener y mostrar los registros
    this.findAll();
  }

  findAll(page: number = 0) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.rubricNotesHttpService
      .findAll(page, this.search.value)
      .subscribe((rubricNotes) => {
        this.rubricNotes = rubricNotes.filter(
          // Filtrar y procesar los registros obtenidos
          (rubricNotes) =>
          rubricNotes.note <= 69 && rubricNotes.teacher.career.id == this.id
        );
         // Calcular las notas y mostrar los resultados
        this.calculateNote();
      });
  }

  getColumns(): ColumnModel[] {
    return [
      { field: 'identification_card', header: 'Cedúla' },
      { field: 'student', header: 'Nombre del Estudiante' },
      { field: 'note', header: 'Nota' },
    ];
  }

  paginate(event: any) {
    this.findAll(event.page);
  }

  // Seleccionar una nota de rubrica específica
  selectNoteDefense(noteDefense: NoteDefenseModel) {
    this.selectedNoteDefense = noteDefense;
  }

  // Calcular las notas promedio y mostrar los resultados
  calculateNote() {
    let totalNote = 0;
    let student: StudentModel;
    let count = 0;
    for (let rubric of this.noteDefenses) {
      if (
        student &&
        rubric.nameStudent &&
        rubric.nameStudent.id != student.id
      ) {
        const divideNote = totalNote / count;
        const noteRounded = Math.round(divideNote);
        this.noteDefenses.push({
          score: noteRounded,
          nameStudent: student,
        });
        totalNote = 0;
        count = 0;
        console.log(noteRounded);
      }

      if (rubric.nameStudent) {
        student = rubric.nameStudent;
      }
      totalNote += parseFloat(rubric.score.toString());
      count++;
    }
    const divideNote = totalNote / count;
    const noteRounded = Math.round(divideNote);
    // Agregar la nota calculada final a la lista de notas
    this.noteDefenses.push({
      score: noteRounded,
      nameStudent: student,
    });
  }
}
