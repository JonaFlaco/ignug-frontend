import { CatalogueModel } from "./catalogue.model";
//import { CareerModel } from "./career.model";

export interface ModalityModel {
    id: string;
    //career?: CareerModel[];
    state: boolean;
    description: string;
    name: string;
   }
  export interface CreateModalityDto extends Omit<ModalityModel, 'id'> {
  }

  export interface UpdateModalityDto extends Partial<Omit<ModalityModel, 'id'>> {
  }

  export interface ReadModalityDto extends Partial<ModalityModel> {
  }

  export interface SelectModalityDto extends Partial<ModalityModel> {
  }
