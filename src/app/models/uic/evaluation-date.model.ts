export interface EvaluationDateModel {
  id: string;
  dni:string;
  tutor:string;

}

export interface CreateEvaluationDateDto extends Omit<EvaluationDateModel, 'id'> {
}

export interface UpdateEvaluationDateDto extends Partial<Omit<EvaluationDateModel, 'id'>> {
}

export interface ReadEvaluationDateDto extends Partial<EvaluationDateModel> {
}

export interface SelectEvaluationDateDto extends Partial<EvaluationDateModel> {
}
