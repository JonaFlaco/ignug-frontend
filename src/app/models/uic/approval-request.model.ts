import { StudentModel } from "@models/core";

export interface ApprovalRequestModel {
  id:string;
  //names: StudentModel[];
  //identificationCards: StudentModel[];
  //careers: StudentModel[];
  //cellphones: StudentModel[];
  //emails: StudentModel[];
  students: StudentModel[];
  teacher: string;
  schoolPeriod: string;
  current_date: Date;
  }

  export interface CreateApprovalRequestDto extends Omit<ApprovalRequestModel, 'id'> {
  }

  export interface UpdateApprovalRequestDto extends Partial<Omit<ApprovalRequestModel, 'id'>> {
  }

  export interface ReadApprovalRequestDto extends Partial<ApprovalRequestModel> {
  }

  export interface SelectApprovalRequestDto extends Partial<ApprovalRequestModel> {
  }
