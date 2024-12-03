import { ModalityModel } from "./modality.model";
import { PlanningModel} from "./planning.model";

export interface ReviewRequirementModel {
  id:string;
  plannings:PlanningModel[];
  registeredAt: Date;
  observation:string;
  status: string;
  file:string;
}
export interface CreateReviewRequirementDto extends Omit<ReviewRequirementModel, 'id'> {
}

export interface UpdateReviewRequirementDto extends Partial<Omit<ReviewRequirementModel, 'id'>> {
}

export interface SelectReviewRequirementDto extends Partial<ReviewRequirementModel> {
}


