import { StudentModel } from "@models/core";
import { CatalogueModel } from "./catalogue.model";
import { ModalityModel } from "./modality.model";
import { PlanningModel } from "./planning.model";
//import { MeshStudentModel } from "./ignug/mesh-student.model";


export interface EnrollmentModel {
    id: string;
    //meshStudentId:MeshStudentModel;
    //modalityId:ModalityModel[];
    //planningId:PlanningModel[];
    student:StudentModel;
    state:string;
    stateM:boolean;
    code:string;
    observation:string;
    registeredAt:Date;
}
export interface CreateEnrollmentDto extends Omit<EnrollmentModel, 'id'> {
}

export interface UpdateEnrollmentDto extends Partial<Omit<EnrollmentModel, 'id'>> {
}

export interface SelectEnrollmentDto extends Partial<EnrollmentModel> {
}
