import { StudentModel } from "@models/core";

export interface DefenseApprovedModel {
  rating:number,
  student:StudentModel;
}


export interface CreateDefenseApprovedDto extends Omit<DefenseApprovedModel, 'id'> {
}

export interface UpdateDefenseApprovedDto extends Partial<Omit<DefenseApprovedModel, 'id'>> {
}

export interface ReadDefenseApprovedDto extends Partial<DefenseApprovedModel> {
}

export interface SelectDefenseApprovedDto extends Partial<DefenseApprovedModel> {
}
