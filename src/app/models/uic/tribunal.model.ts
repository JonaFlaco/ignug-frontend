import { EstudianteModel, TeacherModel } from '@models/uic';
export interface TribunalModel {
  id: string;
  name: EstudianteModel[];
  president: TeacherModel[];
  tutor: TeacherModel[];
  vocal: TeacherModel[];
  date: Date;
  score: number;
  score2: number;
  score3: number;
  place:string;
}

export interface CreateTribunalDto extends Omit<TribunalModel, 'id'> {
}

export interface UpdateTribunalDto extends Partial<Omit<TribunalModel, 'id'>> {
}

export interface ReadTribunalDto extends Partial<TribunalModel> {
}

export interface SelectTribunalDto extends Partial<TribunalModel> {
}
