import { CareerModel } from '@models/core';
import { YearModel } from '@models/core';
import { PlanningModel } from '@models/uic';
export interface PreparationCourseModel {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  description: string;
  year: YearModel;
  carrers: CareerModel;
  planningName:PlanningModel;

}

export interface CreatePreparationCourseDto extends Omit<PreparationCourseModel, 'id'> {
}

export interface UpdatePreparationCourseDto extends Partial<Omit<PreparationCourseModel, 'id'>> {
}

export interface ReadPreparationCourseDto extends Partial<PreparationCourseModel> {
}

export interface SelectPreparationCourseDto extends Partial<PreparationCourseModel> {
}
