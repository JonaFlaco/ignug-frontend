export interface CaseViewModel {
  id: string;
  theme: string;
  members:string;
  summary:string;
}

export interface CreateCaseViewDto extends Omit<CaseViewModel, 'id'> {
}

export interface UpdateCaseViewDto extends Partial<Omit<CaseViewModel, 'id'>> {
}

export interface ReadCaseViewDto extends Partial<CaseViewModel> {
}

export interface SelectCaseViewDto extends Partial<CaseViewModel> {
}
