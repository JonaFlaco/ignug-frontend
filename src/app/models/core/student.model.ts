import { UserModel } from "@models/auth";
import { CareerModel } from "./career.model";
import { RubricNoteModel } from "@models/uic/rubric-note.model";

export interface StudentModel {
    id: string;
    user: UserModel;
    career: CareerModel;
    name: string;
    identification_card: number;
    // ethnicity: string;
    // gender: string;
    // email: string;
    // cellphone: string;
    note:RubricNoteModel[];
  }

  export interface CreateStudentDto extends Omit<StudentModel, 'id'> {
  }

  export interface UpdateStudentDto extends Partial<Omit<StudentModel, 'id'>> {
  }

  export interface ReadStudentDto extends Partial<StudentModel> {
  }

  export interface SelectStudentDto extends Partial<StudentModel> {
  }
