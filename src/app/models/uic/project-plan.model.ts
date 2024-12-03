export interface ProjectPlanModel {
  id: string;
  title:string;
}
export interface CreateProjectPlanDto extends Omit<ProjectPlanModel, 'id'> {
}

export interface UpdateProjectPlanDto extends Partial<Omit<ProjectPlanModel, 'id'>> {
}

export interface SelectProjectPlanDto extends Partial<ProjectPlanModel> {
}
