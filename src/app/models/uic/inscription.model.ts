import { CatalogueModel ,ModalityModel,PlanningModel, StudentInformationModel } from "@models/uic";
import { StudentInformationComponent } from "src/app/pages/uic/student-information/student-information.component";

export interface InscriptionModel {
  id: string;
  studentName: StudentInformationModel[];
  dni: string;
  isEnable: boolean;
  observation: string;
  document: string;
  requirement: string;
  request: string;
  docUpload: boolean;
  modality: string;
  status: string;
}

export interface CreateInscriptionDto extends Omit<InscriptionModel, 'id'> {
}

export interface UpdateInscriptionDto extends Partial<Omit<InscriptionModel, 'id'>> {
}

export interface ReadInscriptionDto extends Partial<InscriptionModel> {
}

export interface SelectInscriptionDto extends Partial<InscriptionModel> {
}

