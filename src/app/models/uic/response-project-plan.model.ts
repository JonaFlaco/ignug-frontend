export interface ResponseProjectPlanModel{
  id: string;
  observation:string;
  tutorId?:string;
  studentId?: string;
  studentSelectId?: string;
  title: string;
  answeredAt: Date;
  state:string;
}
export interface CreateResponseProjectPlanDto extends Omit<ResponseProjectPlanModel, 'id'> {
}

export interface UpdateResponseProjectPlanDto extends Partial<Omit<ResponseProjectPlanModel, 'id'>> {
}

export interface SelectResponseProjectPlanDto extends Partial<ResponseProjectPlanModel> {
}
