import { TeacherModel } from '@models/core';
import { EstudianteModel, StudentInformationModel } from '@models/uic';
export interface PracticalCaseModel {
  id: string;
  proyect: string;
  startDate: Date;
  endDate: Date;
  student: StudentInformationModel;
  teacher: TeacherModel;

}

export interface CreatePracticalCaseDto extends Omit<PracticalCaseModel, 'id'> {
}

export interface UpdatePracticalCaseDto extends Partial<Omit<PracticalCaseModel, 'id'>> {
}

export interface ReadPracticalCaseDto extends Partial<PracticalCaseModel> {
}

export interface SelectPracticalCaseDto extends Partial<PracticalCaseModel> {
}
