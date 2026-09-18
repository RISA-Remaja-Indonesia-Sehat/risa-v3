export type StarRating =
  | 0
  | 1
  | 2
  | 3;

export type GameResult = {
  stars: StarRating;

  title: string;
  message: string;

  score?: number;
  total?: number;

  summary?: string;
};