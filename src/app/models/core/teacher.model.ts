import { CareerModel } from "./career.model";
import { UserModel } from '../auth/user.model';

export interface TeacherModel {
  id: string;
  career: CareerModel;
  name :string;
  user:UserModel;
}

export interface CreateTeacherDto extends Omit<TeacherModel, 'id'> {
}

export interface UpdateTeacherDto extends Partial<Omit<TeacherModel, 'id'>> {
}

export interface ReadTeacherDto extends Partial<TeacherModel> {
}

export interface SelectTeacherDto extends Partial<TeacherModel> {
}

