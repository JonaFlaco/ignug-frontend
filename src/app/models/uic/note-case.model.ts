import { StudentModel } from "@models/core";
export interface NoteCaseModel {
  student:StudentModel;
  practicalNote:number,
  defenseNote:number,
  totalScore:number,
}


export interface CreateNoteCaseDto extends Omit<NoteCaseModel, 'id'> {
}

export interface UpdateNoteCaseDto extends Partial<Omit<NoteCaseModel, 'id'>> {
}

export interface ReadNoteCaseDto extends Partial<NoteCaseModel> {
}

export interface SelectNoteCaseDto extends Partial<NoteCaseModel> {
}
