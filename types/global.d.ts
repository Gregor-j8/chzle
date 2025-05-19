export {};

export type Puzzle = {
  id: string
  fen: string
  moves: string
  rating?: number
  source?: string
  themes?: string[]
  createdAt?: Date
};
