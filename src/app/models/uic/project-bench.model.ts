import { CatalogueModel } from "./catalogue.model";
import { TeacherModel } from '@models/core';

export interface ProjectBenchModel {
    id: string;
    teacher: TeacherModel;
    title: string;
    name: string;
    description: string;
    state: boolean;
   }
  export interface CreateProjectBenchDto extends Omit<ProjectBenchModel, 'id'> {
  }

  export interface UpdateProjectBenchDto extends Partial<Omit<ProjectBenchModel, 'id'>> {
  }

  export interface ReadProjectBenchDto extends Partial<ProjectBenchModel> {
  }

  export interface SelectProjectBenchDto extends Partial<ProjectBenchModel> {
  }
