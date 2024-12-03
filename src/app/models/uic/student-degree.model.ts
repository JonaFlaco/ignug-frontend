import { EstudianteModel } from "./estudiante.model";
import { ModalityModel } from "./modality.model";
import { PlanningModel } from "./planning.model";

export interface StudentDegreeModel {
    id: string;
    //modalities:ModalityModel[];
    nameModalities: ModalityModel[];
    //plannings:PlanningModel[];
    namePlannings: PlanningModel[];
    nameEstudiantes: EstudianteModel[];
    //observations:string;
    title:string;
    observation: string;
    state:boolean;
    requerimientos:string;
    file:string;
}
export interface CreateStudentDegreeDto extends Omit<StudentDegreeModel, 'id'> {
}

export interface UpdateStudentDegreeDto extends Partial<Omit<StudentDegreeModel, 'id'>> {
}

export interface SelectStudentDegreeDto extends Partial<StudentDegreeModel> {
}
