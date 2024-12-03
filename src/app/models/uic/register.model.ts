import { PreparationCourseModel, TeacherModel } from ".";

export interface RegisterModel {
  id: string;
  name: string;
  hours: number;
  // tutor: TeacherModel[];
  // courses: PreparationCourseModel[];
  date: Date;
  //endDate: Date;
}

export interface CreateRegisterDto extends Omit<RegisterModel, 'id'> {
}

export interface UpdateRegisterDto extends Partial<Omit<RegisterModel, 'id'>> {
}

export interface ReadRegisterDto extends Partial<RegisterModel> {
}

export interface SelectRegisterDto extends Partial<RegisterModel> {
}
