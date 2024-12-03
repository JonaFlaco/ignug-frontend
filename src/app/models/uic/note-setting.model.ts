import { StudentModel } from '@models/core';

export interface NoteSettingModel {
  id: string;
  student: StudentModel;
  evaluation: number;
  document: number;
  note:number;
}

export interface CreateNoteSettingDto extends Omit<NoteSettingModel, 'id'> {}

export interface UpdateNoteSettingDto extends Partial<Omit<NoteSettingModel, 'id'>> {}

export interface ReadNoteSettingDto extends Partial<NoteSettingModel> {}

export interface SelectNoteSettingDto extends Partial<NoteSettingModel> {}
