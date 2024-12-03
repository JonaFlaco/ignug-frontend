import { ModalityModel } from "./modality.model";
import { ProfessionModel } from "./profession.model";

export interface RequirementFormatModel {
  id: string;
  nameFormat: string;
  nameModality: ModalityModel;
  nameCareer: ProfessionModel;
  filename: string;
  required: boolean;
}
export interface CreateRequirementFormatDto
  extends Omit<RequirementFormatModel, 'id'> {}

export interface UpdateRequirementFormatDto
  extends Partial<Omit<RequirementFormatModel, 'id'>> {}

export interface SelectRequirementFormatDto
  extends Partial<RequirementFormatModel> {}

export interface ReadRequirementFormatDto
  extends Partial<RequirementFormatModel> {}
