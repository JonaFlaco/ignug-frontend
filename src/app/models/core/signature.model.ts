
export interface SignatureCatModel {
  id: string;
  name: string;
  code: string;
  state: boolean;
  description: string;
}

export interface CreateSignatureCatDto extends Omit<SignatureCatModel, 'id'> {
}

export interface UpdateSignatureCatDto extends Partial<Omit<SignatureCatModel, 'id'>> {
}

export interface ReadSignatureCatDto extends Partial<SignatureCatModel> {
}

export interface SelectSignatureCatDto extends Partial<SignatureCatModel> {
}
