import { TribunalModel } from './tribunal.model';
import { UploadProjectModel } from './upload-project.model';
export interface CourtProjectModel {
  id: string;
  // tribunal: TribunalModel[];
  tribunal: string;
  proyects: UploadProjectModel[];
  place: string;
  description: string;
  defenseAt: Date;
}

export interface CreateCourtProjectDto extends Omit<CourtProjectModel, 'id'> {
}

export interface UpdateCourtProjectDto extends Partial<Omit<CourtProjectModel, 'id'>> {
}

export interface ReadCourtProjectDto extends Partial<CourtProjectModel> {
}

export interface SelectCourtProjectDto extends Partial<CourtProjectModel> {
}
