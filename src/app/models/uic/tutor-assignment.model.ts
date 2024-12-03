import { StudentInformationModel, TeacherModel, UploadProjectModel } from '@models/uic';
import {
   CatalogueModel,
    ModalityModel,
    EstudianteModel
}from '@models/uic';

export interface TutorAssignmentModel{
  id:string;
  uploadProject:UploadProjectModel[];
  teacher:TeacherModel[];
  types:CatalogueModel[];
  student:StudentInformationModel[];
  observations:string;

}
export interface CreateTutorAssignmentDto extends Omit<TutorAssignmentModel, 'id'> {
}

export interface UpdateTutorAssignmentDto extends Partial<Omit<TutorAssignmentModel, 'id'>> {
}

export interface SelectTutorAssignmentDto extends Partial<TutorAssignmentModel> {
}
