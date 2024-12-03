import { EstudianteModel } from "./estudiante.model";
import { EventModel } from "./event.model";

export interface ResponsibleTutorModel {
  id:string;
  nameStudent:EstudianteModel[];
  approved: boolean;
  observation:string;
  score:number;
  date: Date;
}
export interface CreateResponsibleTutorDto extends Omit<ResponsibleTutorModel, 'id'> {
}

export interface UpdateResponsibleTutorDto extends Partial<Omit<ResponsibleTutorModel, 'id'>> {
}

export interface SelectResponsibleTutorDto extends Partial<ResponsibleTutorModel> {
}

//export interface ReadResponsibleTutorDto extends Partial<ResponsibleTutorModel> {
//}
