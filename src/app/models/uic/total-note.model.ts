export interface TotalNoteModel {
  id: string;
  noteOne: string;
  noteTwo: string;
  finalNote: string;

}

export interface CreateTotalNoteDto extends Omit<TotalNoteModel, 'id'> {
}

export interface UpdateTotalNoteDto extends Partial<Omit<TotalNoteModel, 'id'>> {
}

export interface ReadTotalNoteDto extends Partial<TotalNoteModel> {
}

export interface SelectTotalNoteDto extends Partial<TotalNoteModel> {
}
