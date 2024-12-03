import { PlanningModel } from "./planning.model";
import { CatalogueModel } from './catalogue.model';

export interface RequirementModel{
  id:string;
  // required:boolean;
  description:string;
  plannings:PlanningModel[];
  nameCatalogue:CatalogueModel[];
  status: string;
}

export interface CreateRequirementDto extends Omit<RequirementModel, 'id'> {
}

export interface UpdateRequirementDto extends Partial<Omit<RequirementModel, 'id'>> {
}

export interface SelectRequirementDto extends Partial<RequirementModel> {
}
