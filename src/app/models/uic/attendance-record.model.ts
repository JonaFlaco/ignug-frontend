import { ModalityModel } from "./modality.model";
import { PlanningModel} from "./planning.model";

export interface AttendanceRecordModel {
  id:string;
  plannings:PlanningModel[];

}
export interface CreateAttendanceRecordDto extends Omit<AttendanceRecordModel, 'id'> {
}

export interface UpdateAttendanceRecordDto extends Partial<Omit<AttendanceRecordModel, 'id'>> {
}

export interface SelectAttendanceRecordDto extends Partial<AttendanceRecordModel> {
}


