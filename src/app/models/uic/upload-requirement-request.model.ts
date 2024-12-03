import { PlanningModel} from "./planning.model";

export interface UploadRequirementRequestModel {
  id?:string;
  plannings?:PlanningModel[];
  file:string;
}
export interface CreateUploadRequirementRequestDto extends Omit<UploadRequirementRequestModel, 'id'> {
}

export interface UpdateUploadRequirementRequestDto extends Partial<Omit<UploadRequirementRequestModel, 'id'>> {
}

export interface SelectUploadRequirementRequestDto extends Partial<UploadRequirementRequestModel> {
}
