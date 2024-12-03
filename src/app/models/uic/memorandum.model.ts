import { StudentModel, TeacherModel } from "@models/core";

export interface MemorandumModel {
  id: string;
  nameTeacher: TeacherModel;
  nameStudent: StudentModel;
  type: string;
  lab: string;
  dateWritten: Date;
  dateApplication: Date;
  time: string;
}

export interface CreateMemorandumDto extends Omit<MemorandumModel, 'id'> {
}

export interface UpdateMemorandumDto extends Partial<Omit<MemorandumModel, 'id'>> {
}

export interface ReadMemorandumDto extends Partial<MemorandumModel> {
}

export interface SelectMemorandumDto extends Partial<MemorandumModel> {
}
