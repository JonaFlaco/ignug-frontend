export interface CareerModel {
   id: string;
  acronym?: string;
  // code?: string;
  // codeSniese?: string;
  degree: string;
  // logo?: string;
  name: string;
  // resolutionNumber?: string;
  //shortName?: string;
}

export interface CreateCareerDto extends Omit<CareerModel, 'id'> {
}

export interface UpdateCareerDto extends Partial<Omit<CareerModel, 'id'>> {
}

export interface SelectCareerDto extends Partial<CareerModel> {
}

export interface ReadCareerDto extends Partial<CareerModel> {
}
