import { ProjectPlanModel, EnrollmentModel } from '@models/uic';
export interface ProjectModel {
  id: string;
  title: string;
  approved: boolean;
  description:string;
  score:number;
  observation:string;
  projectPlans:ProjectPlanModel[];
  enrollments:EnrollmentModel[];
}

export interface CreateProjectDto extends Omit<ProjectModel, 'id'> {
}

export interface UpdateProjectDto extends Partial<Omit<ProjectModel, 'id'>> {
}

export interface SelectProjectDto extends Partial<ProjectModel> {
}
