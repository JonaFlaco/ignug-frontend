import { CatalogueModel ,PlanningModel } from "@models/uic";

export interface YearModel {
  id: string;
  year: string;
}

export interface CreateYearDto extends Omit<YearModel, 'id'> {
}

export interface UpdateYearDto extends Partial<Omit<YearModel, 'id'>> {
}

export interface ReadYearDto extends Partial<YearModel> {
}

export interface SelectYearDto extends Partial<YearModel> {
}
