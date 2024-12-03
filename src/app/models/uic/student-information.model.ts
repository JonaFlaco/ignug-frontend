import { StatusEnum } from "@shared/enums";


export interface StudentInformationModel {
  // student: StudentModel[];
  id: string;
  cedula: number;
  name: string;
  phone: number;
  genre: string;
  personalEmail: string;
  email: string;
  birthDate: Date;
  provinceBirth: string;
  cantonBirth: string;
  currentLocation: string;
  entryCohort: string;
  exitCohort: Date;
  companyWork: string;
  companyArea: string;
  companyPosition: string;
  laborRelation: string;
  state: boolean;
  // status: StatusEnum;
}

export interface CreateStudentInformationDto extends Omit<StudentInformationModel, 'id'> {
}

export interface UpdateStudentInformationDto extends Partial<Omit<StudentInformationModel, 'id'>> {
}

export interface ReadStudentInformationDto extends Partial<StudentInformationModel> {
}

export interface SelectStudentInformationDto extends Partial<StudentInformationModel> {
}
