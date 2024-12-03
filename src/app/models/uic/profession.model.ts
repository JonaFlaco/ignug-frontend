import { CatalogueModel ,PlanningModel } from "@models/uic";

export interface ProfessionModel {
  id: string;
  career: string;
  // names: CatalogueModel[];
  // plannings: PlanningModel[];
  // endDate: Date;
  // isEnable: boolean;
  // sort: number;
  // startDate: Date;
}

export interface CreateProfessionDto extends Omit<ProfessionModel, 'id'> {
}

export interface UpdateProfessionDto extends Partial<Omit<ProfessionModel, 'id'>> {
}

export interface ReadProfessionDto extends Partial<ProfessionModel> {
}

export interface SelectProfessionDto extends Partial<ProfessionModel> {
}
