import { CatalogueModel ,PlanningModel } from "@models/uic";

export interface AssignamentModel {
  id: string;
  names: CatalogueModel[];
  plannings: PlanningModel[];
  endDate: Date;
  isEnable: boolean;
  sort: number;
  startDate: Date;
}

export interface CreateAssignamentDto extends Omit<AssignamentModel, 'id'> {
}

export interface UpdateAssignamentDto extends Partial<Omit<AssignamentModel, 'id'>> {
}

export interface ReadAssignamentDto extends Partial<AssignamentModel> {
}

export interface SelectAssignamentDto extends Partial<AssignamentModel> {
}
