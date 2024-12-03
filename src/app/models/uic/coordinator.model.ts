import { CatalogueModel, PlanningModel } from '@models/uic';
export interface CoordinatorModel{
  id: string;
  planning?:PlanningModel[]; //convocatoria
  state?:CatalogueModel[];
  requestedAt: Date;
  answeredAt: Date;
  observation:string;
  title:string;
}
export interface CreateCoordinatorDto extends Omit<CoordinatorModel, 'id'> {
}

export interface SelectCoordinatorDto extends Partial<CoordinatorModel> {
}
