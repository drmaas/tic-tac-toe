export interface History {
  boardState: (string | null)[];
  coords: Coords;
}

export interface Coords {
  row: number;
  column: number;
}
