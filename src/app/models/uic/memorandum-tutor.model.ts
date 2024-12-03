import { StudentModel, TeacherModel } from "@models/core";
import { PracticalCaseModel } from "./practical-case.model";

export interface MemorandumTutorModel {
  id: string;
  nameTeacher: TeacherModel;
  nameStudent: StudentModel;
  topic: PracticalCaseModel;
  type: string;
  dateWritten: Date;
}

export interface CreateMemorandumTutorDto extends Omit<MemorandumTutorModel, 'id'> {
}

export interface UpdateMemorandumTutorDto extends Partial<Omit<MemorandumTutorModel, 'id'>> {
}

export interface ReadMemorandumTutorDto extends Partial<MemorandumTutorModel> {
}

export interface SelectMemorandumTutorDto extends Partial<MemorandumTutorModel> {
}
