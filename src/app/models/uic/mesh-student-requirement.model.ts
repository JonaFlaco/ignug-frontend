import { RequirementModel } from '@models/uic';
//import { MeshStudentModel } from '@models/ignug';

export interface MeshStudentRequirementModel{
  id:string;
  //meshStudentId:MeshStudentModel[];
  requirements:RequirementModel[];
  approved:boolean;
  observations:string;
  file:string;

}
export interface CreateMeshStudentRequirementDto extends Omit<MeshStudentRequirementModel, 'id'> {
}

export interface UpdateMeshStudentRequirementDto extends Partial<Omit<MeshStudentRequirementModel, 'id'>> {
}

export interface SelectMeshStudentRequirementDto extends Partial<MeshStudentRequirementModel> {
}
