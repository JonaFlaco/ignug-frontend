export interface TeacherModel {
  id: string;
  dni:string;
  tutor:string;
  state:boolean;
}

export interface CreateTeacherDto extends Omit<TeacherModel, 'id'> {
}

export interface UpdateTeacherDto extends Partial<Omit<TeacherModel, 'id'>> {
}

export interface ReadTeacherDto extends Partial<TeacherModel> {
}

export interface SelectTeacherDto extends Partial<TeacherModel> {
}
