export interface RatingWeightModel {
  id: string;
  weightOne: number;
  weightTwo: number;

}

export interface CreateRatingWeightDto extends Omit<RatingWeightModel, 'id'> {
}

export interface UpdateRatingWeightDto extends Partial<Omit<RatingWeightModel, 'id'>> {
}

export interface ReadRatingWeightDto extends Partial<RatingWeightModel> {
}

export interface SelectRatingWeightDto extends Partial<RatingWeightModel> {
}
