
import { CareerModel } from '../core/career.model';

export interface UploadScoreModel {
  id: string;
  name:string;
  dni:string;
  nameCareer:CareerModel[];
  score:number;
}

export interface CreateUploadScoreDto extends Omit<UploadScoreModel, 'id'> {
}

export interface UpdateUploadScoreDto extends Partial<Omit<UploadScoreModel, 'id'>> {
}

export interface ReadUploadScoreDto extends Partial<UploadScoreModel> {
}

export interface SelectUploadScoreDto extends Partial<UploadScoreModel> {
}
