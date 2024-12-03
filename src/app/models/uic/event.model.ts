import { CatalogueModel ,PlanningModel } from "@models/uic";

export interface EventModel {
  id: string;
  // name:CatalogueModel;
  catalogue: CatalogueModel;
  plannings: PlanningModel[];
  endDate: Date;
  isEnable: boolean;
  sort: number;
  startDate: Date;
}

export interface CreateEventDto extends Omit<EventModel, 'id'> {
}

export interface UpdateEventDto extends Partial<Omit<EventModel, 'id'>> {
}

export interface ReadEventDto extends Partial<EventModel> {
}

export interface SelectEventDto extends Partial<EventModel> {
}
