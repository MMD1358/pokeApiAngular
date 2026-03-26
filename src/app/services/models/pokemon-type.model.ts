export type PokemonTypeKey =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export interface PokemonType {
  name: PokemonTypeKey;
  icon: string;
}

export interface PokemonTypeApiResponse {
  id: number;
  name: string;
  sprites?: {
    'generation-iii'?: {
      emerald?: {
        name_icon: string | null;
        symbol_icon: string | null;
      };
    };
  };
}
