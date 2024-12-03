import { CatalogueTypeModel } from '@models/uic';

export interface CatalogueModel {
  id: string;
  name: string;

  description:string;
  state: boolean;
  catalogueType:CatalogueTypeModel;
  // names:CatalogueModel;
}

export interface CreateCatalogueDto extends Omit<CatalogueModel, 'id'> {
}

export interface UpdateCatalogueDto extends Partial<Omit<CatalogueModel, 'id'>> {
}
export interface ReadCatalogueDto extends Partial<CatalogueModel> {
}
export interface SelectCatalogueDto extends Partial<CatalogueModel> {
}
