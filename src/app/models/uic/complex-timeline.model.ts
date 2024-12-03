import { UploadProjectModel } from '@models/uic';

export interface ComplexTimelineModel {
  id: string;
  activity: string;
  meetingDate:string;
  description:string;
  topicProject:UploadProjectModel[];
}

export interface CreateComplexTimelineDto extends Omit<ComplexTimelineModel, 'id'> {
}

export interface UpdateComplexTimelineDto extends Partial<Omit<ComplexTimelineModel, 'id'>> {
}

export interface ReadComplexTimelineDto extends Partial<ComplexTimelineModel> {
}

export interface SelectComplexTimelineDto extends Partial<ComplexTimelineModel> {
}
