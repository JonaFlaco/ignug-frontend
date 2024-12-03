
import { CareerModel } from '../core/career.model';

export interface UploadProjectModel {
  id: string;
  theme:string;
  members:string;
  summary:string;
  nameCareer:CareerModel[];
}

export interface CreateUploadProjectDto extends Omit<UploadProjectModel, 'id'> {
}

export interface UpdateUploadProjectDto extends Partial<Omit<UploadProjectModel, 'id'>> {
}

export interface ReadUploadProjectDto extends Partial<UploadProjectModel> {
}

export interface SelectUploadProjectDto extends Partial<UploadProjectModel> {
}
