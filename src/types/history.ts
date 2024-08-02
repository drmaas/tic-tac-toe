import { Board } from "./board";

export interface History {
  boardState: Board;
  coords: Coords;
}

export interface Coords {
  row: number;
  column: number;
}
