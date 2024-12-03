//import {PermissionModel} from './modality.model';

import { CareerModel, YearModel } from '@models/core';
import {  ModalityModel ,ProfessionModel } from '@models/uic';

export interface PlanningModel {
  id: string;
  description: string;
  endDate: Date;
  name: string;
  startDate: Date;
  state: boolean;
  nameModality: ModalityModel;
  //professions: ProfessionModel[];
  carrers: CareerModel[];
  // career: CareerModel[];
  year: YearModel[];
}

export interface CreatePlanningDto extends Omit<PlanningModel, 'id'> {
}

export interface UpdatePlanningDto extends Partial<Omit<PlanningModel, 'id'>> {
}

export interface ReadPlanningDto extends Partial<PlanningModel> {
}

export interface SelectPlanningDto extends Partial<PlanningModel> {
}
