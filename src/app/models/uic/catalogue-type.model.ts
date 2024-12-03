
export interface CatalogueTypeModel {
  id: string;
  name: string;
  code: string;
}

export interface CreateCatalogueTypeDto extends Omit<CatalogueTypeModel, 'id'> {
}

export interface UpdateCatalogueTypeDto extends Partial<Omit<CatalogueTypeModel, 'id'>> {
}

export interface ReadCatalogueTypeDto extends Partial<CatalogueTypeModel> {
}

export interface SelectCatalogueTypeDto extends Partial<CatalogueTypeModel> {
}
