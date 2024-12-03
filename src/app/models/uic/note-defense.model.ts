import { StudentModel } from "@models/core";
import { RubricNoteModel } from "./rubric-note.model";

export interface NoteDefenseModel {
  score:number,
  nameStudent:StudentModel;
}


export interface CreateNoteDefenseDto extends Omit<NoteDefenseModel, 'id'> {
}

export interface UpdateNoteDefenseDto extends Partial<Omit<NoteDefenseModel, 'id'>> {
}

export interface ReadNoteDefenseDto extends Partial<NoteDefenseModel> {
}

export interface SelectNoteDefenseDto extends Partial<NoteDefenseModel> {
}
