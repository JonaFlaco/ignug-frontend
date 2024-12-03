import { EstudianteModel, ProjectBenchModel, StudentInformationModel, TeacherModel } from '@models/uic';
export interface NoteModel {
  id: string;
  studentInformations: StudentInformationModel[];
  projectBenchs: ProjectBenchModel[];
  state: boolean;
  description: string;
  score: number;
  score2: number;
  score3: number;
  score4: number;
  observation: string;
}

export interface CreateNoteDto extends Omit<NoteModel, 'id'> {
}

export interface UpdateNoteDto extends Partial<Omit<NoteModel, 'id'>> {
}

export interface ReadNoteDto extends Partial<NoteModel> {
}

export interface SelectNoteDto extends Partial<NoteModel> {
}
