export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListApi[];
}

export interface PokemonListApi {
  name: string;
  url: string;
}
