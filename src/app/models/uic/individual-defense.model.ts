export interface IndividualDefenseModel {
  id: string;
  noteOne: string;
  noteTwo: string;
  finalNote: string;

}

export interface CreateIndividualDefenseDto extends Omit<IndividualDefenseModel, 'id'> {
}

export interface UpdateIndividualDefenseDto extends Partial<Omit<IndividualDefenseModel, 'id'>> {
}

export interface ReadIndividualDefenseDto extends Partial<IndividualDefenseModel> {
}

export interface SelectIndividualDefenseDto extends Partial<IndividualDefenseModel> {
}
