import { RequirementModel } from "./requirement.model";

export interface RequirementRequestModel {
  id:string;
  name:RequirementModel[];
  //meshStudents:MeshStudentModel[];
  registeredAt: Date;
  approved:boolean;
  observations:string;

}
export interface CreateRequirementRequestDto extends Omit<RequirementRequestModel, 'id'> {
}

export interface UpdateRequirementRequestDto extends Partial<Omit<RequirementRequestModel, 'id'>> {
}

export interface SelectRequirementRequestDto extends Partial<RequirementRequestModel> {
}

//export interface ReadRequirementRequestDto extends Partial<RequirementRequestModel> {
//}
