declare module 'js-chess-engine' {
    export class Game {
      constructor(fen?: string);
      aiMove(level: number): { [key: string]: string };
      move(from: string, to: string): void;
      get fen(): string;
    }
  }