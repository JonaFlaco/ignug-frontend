import { ModalityModel } from "./modality.model";

export interface DownloadFormatModel {
  id: string;
  request:ModalityModel[];
  name:string;
  file:string;
  state:boolean;

}

export interface CreateDownloadFormatDto extends Omit< DownloadFormatModel, 'id'> {
}

export interface UpdateDownloadFormatDto extends Partial<Omit< DownloadFormatModel, 'id'>> {
}

export interface ReadDownloadFormatDto extends Partial< DownloadFormatModel> {
}

export interface SelectDownloadFormatDto extends Partial< DownloadFormatModel> {
}
