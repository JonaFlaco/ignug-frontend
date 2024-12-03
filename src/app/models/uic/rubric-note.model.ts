import { StudentModel, TeacherModel } from '@models/core';
import { RubricModel } from './rubric.model';
export interface RubricNoteModel {
  id: string;
  rubric: RubricModel;
  note: number;
  teacher:TeacherModel;
  student:StudentModel;

}

export interface CreateRubricNoteDto extends Omit<RubricNoteModel, 'id'> {
}

export interface UpdateRubricNoteDto extends Partial<Omit<RubricNoteModel, 'id'>> {
}

export interface ReadRubricNoteDto extends Partial<RubricNoteModel> {
}

export interface SelectRubricNoteDto extends Partial<RubricNoteModel> {
}
