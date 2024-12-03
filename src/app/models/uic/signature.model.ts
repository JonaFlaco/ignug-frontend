import { SignatureCatModel, TeacherModel } from "@models/core";
import { PreparationCourseModel } from "@models/uic";

export interface SignatureModel {
  id: string;
  name: string;
  hours: number;
  tutor: TeacherModel[];
  signature:SignatureCatModel;
  preparationCourses: PreparationCourseModel[];
  startDate: Date;
  endDate: Date;
}

export interface CreateSignatureDto extends Omit<SignatureModel, 'id'> {
}

export interface UpdateSignatureDto extends Partial<Omit<SignatureModel, 'id'>> {
}

export interface ReadSignatureDto extends Partial<SignatureModel> {
}

export interface SelectSignatureDto extends Partial<SignatureModel> {
}
