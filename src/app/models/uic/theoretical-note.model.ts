import { EnrollmentRoutingModule } from '../../pages/uic/enrollment/enrollment-routing.module';
import { EnrollmentModel } from './enrollment.model';
export interface TheoricalNoteModel {
  id: string;
  // students: StudentModel[];
  name: EnrollmentModel;
  note: number;
  observations: string;
}

export interface CreateTheoricalNoteDto extends Omit<TheoricalNoteModel, 'id'> {
}

export interface UpdateTheoricalNoteDto extends Partial<Omit<TheoricalNoteModel, 'id'>> {
}

export interface ReadTheoricalNoteDto extends Partial<TheoricalNoteModel> {
}

export interface SelectTheoricalNoteDto extends Partial<TheoricalNoteModel> {
}
