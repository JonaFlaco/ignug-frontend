import { StudentModel } from '@models/core';
import { ItemModel } from './item.model';

export interface RubricModel {
  id: string;
  item: ItemModel[];
  criterio: string;
  criterio2: string;
  criterio3: string;
  criterio4: string;
  criterio5: string;
  nameStudent: StudentModel[];
}

export interface CreateRubricDto extends Omit<RubricModel, 'id'> {}

export interface UpdateRubricDto extends Partial<Omit<RubricModel, 'id'>> {}

export interface ReadRubricDto extends Partial<RubricModel> {}

export interface SelectRubricDto extends Partial<RubricModel> {}
