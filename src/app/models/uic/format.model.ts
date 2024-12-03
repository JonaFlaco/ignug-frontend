export interface FormatModel {
  id: string;
  name:string;
  state:boolean;
  description:string;
  file:string;

}

export interface CreateFormatDto extends Omit<FormatModel, 'id'> {
}

export interface UpdateFormatDto extends Partial<Omit<FormatModel, 'id'>> {
}

export interface ReadFormatDto extends Partial<FormatModel> {
}

export interface SelectFormatDto extends Partial<FormatModel> {
}
