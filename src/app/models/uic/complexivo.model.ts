import { EstudianteModel, TeacherModel } from '@models/uic';
export interface ComplexivoModel {
  id: string;
  name: EstudianteModel[];
  name2: EstudianteModel[];
  president: TeacherModel[];
  tutor: TeacherModel[];
  vocal: TeacherModel[];
  nameCase: string;
}

export interface CreateComplexivoDto extends Omit<ComplexivoModel, 'id'> {
}

export interface UpdateComplexivoDto extends Partial<Omit<ComplexivoModel, 'id'>> {
}

export interface ReadComplexivoDto extends Partial<ComplexivoModel> {
}

export interface SelectComplexivoDto extends Partial<ComplexivoModel> {
}
