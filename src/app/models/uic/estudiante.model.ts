import { TeacherModel } from "./teacher.model";

export interface EstudianteModel {
  id: string;
  dni:string;
  name:string;
  title:string;
  tutor: TeacherModel[];
  observations:string;
  revisionDate: Date;
  state:string;
}

export interface CreateEstudianteDto extends Omit<EstudianteModel, 'id'> {
}

export interface UpdateEstudianteDto extends Partial<Omit<EstudianteModel, 'id'>> {
}

export interface ReadEstudianteDto extends Partial<EstudianteModel> {
}

export interface SelectEstudianteDto extends Partial<EstudianteModel> {
}
