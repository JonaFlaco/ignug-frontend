import { UploadProjectModel } from '@models/uic';

export interface ComplexScheduleModel {
  id: string;
  activity: string;
  description:string;
  startDate: Date;
  endDate: Date;
  state: boolean;
  sort: number;
}

export interface CreateComplexScheduleDto extends Omit<ComplexScheduleModel, 'id'> {
}

export interface UpdateComplexScheduleDto extends Partial<Omit<ComplexScheduleModel, 'id'>> {
}

export interface ReadComplexScheduleDto extends Partial<ComplexScheduleModel> {
}

export interface SelectComplexScheduleDto extends Partial<ComplexScheduleModel> {
}
