import { NoteDefenseModel } from './note-defense.model';
import { NoteSettingModel } from '@models/uic';
import { StudentModel } from '@models/core';


export interface TotalCaseModel {
  id: string;
  student: StudentModel[];
  defense:NoteDefenseModel[];
  setting:NoteSettingModel[];
}

export interface CreateTotalCaseDto extends Omit<TotalCaseModel, 'id'> {}

export interface UpdateTotalCaseDto extends Partial<Omit<TotalCaseModel, 'id'>> {}

export interface ReadTotalCaseDto extends Partial<TotalCaseModel> {}

export interface SelectTotalCaseDto extends Partial<TotalCaseModel> {}
