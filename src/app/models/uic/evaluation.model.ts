import { EstudianteModel } from "./estudiante.model";

export interface EvaluationModel {
  id:string;
  students:EstudianteModel[];
  note: number;
}

export interface CreateEvaluationDto extends Omit<EvaluationModel, 'id'> {
}

export interface UpdateEvaluationDto extends Partial<Omit<EvaluationModel, 'id'>> {
}

export interface SelectEvaluationDto extends Partial<EvaluationModel> {
}
