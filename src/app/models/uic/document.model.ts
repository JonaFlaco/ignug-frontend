import { InscriptionModel, UploadRequirementRequestModel } from "@models/uic";
import { YearModel } from '@models/core';
import { UploadRequirementRequestComponent } from "src/app/pages/uic/upload-requirement-request/upload-requirement-request.component";

export interface DocumentModel {
  id: string;
  observation: string;
  year: YearModel[];
  requerimiento: UploadRequirementRequestModel[];
  estudiante: InscriptionModel[];
  cedula: InscriptionModel[];

}

export interface CreateDocumentDto extends Omit<DocumentModel, 'id'> {
}

export interface UpdateDocumentDto extends Partial<Omit<DocumentModel, 'id'>> {
}

export interface ReadDocumentDto extends Partial<DocumentModel> {
}

export interface SelectDocumentDto extends Partial<DocumentModel> {
}
