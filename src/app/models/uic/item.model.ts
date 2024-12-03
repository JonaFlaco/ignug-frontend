import { CareerModel } from "@models/core";


export interface ItemModel {
  id: string;
  name:string;
  career:CareerModel;
  state: boolean;
}

export interface CreateItemDto extends Omit<ItemModel, 'id'> {
}

export interface UpdateItemDto extends Partial<Omit<ItemModel, 'id'>> {
}

export interface ReadItemDto extends Partial<ItemModel> {
}

export interface SelectItemDto extends Partial<ItemModel> {
}
