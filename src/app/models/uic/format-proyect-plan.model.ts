import { StudentModel } from "@models/core";


export interface FormatProyectPlanModel {
  //name: StudentModel[];
  //career: StudentModel[];
  nameStudents: StudentModel[];
  careerStudents: StudentModel[];
  //campos-normales
  current_date: Date;
  research: string;
  theme: string;
  problem: string;
  objective: string;
  objespecific: string;
  justification:string;
  scopeeme: string;
  theorical: string;
  methodological: string;
  methodology: string;
  bibliography: string;
  budget: string;
  }
  export interface CreateFormatProyectPlanDto extends Omit<FormatProyectPlanModel, 'id'> {
  }

  export interface UpdateFormatProyectPlanDto extends Partial<Omit<FormatProyectPlanModel, 'id'>> {
  }

  export interface ReadFormatProyectPlanDto extends Partial<FormatProyectPlanModel> {
  }

  export interface SelectFormatProyectPlanDto extends Partial<FormatProyectPlanModel> {
  }
