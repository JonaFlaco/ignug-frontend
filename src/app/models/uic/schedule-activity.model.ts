import { UploadProjectModel } from '@models/uic';

export interface ScheduleActivityModel {
  id: string;
  assignment: string;
  description:string;
  startDate: Date;
  endDate: Date;
  state: boolean;
}

export interface CreateScheduleActivityDto extends Omit<ScheduleActivityModel, 'id'> {
}

export interface UpdateScheduleActivityDto extends Partial<Omit<ScheduleActivityModel, 'id'>> {
}

export interface ReadScheduleActivityDto extends Partial<ScheduleActivityModel> {
}

export interface SelectScheduleActivityDto extends Partial<ScheduleActivityModel> {
}
