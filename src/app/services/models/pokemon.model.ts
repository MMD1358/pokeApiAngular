import { PokemonType } from './pokemon-type.model';

export interface PokemonList {
  id: number;
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  picture: string;
  cry: string;
  weight: number;
  height: number;
  types: PokemonType[];
  sprites: PokemonSprite[];
  movements: PokemonMovement[];
  stats: PokemonStat[];
}

export const SPRITE_KEYS = ['front_default', 'back_default', 'front_shiny', 'back_shiny'] as const;

export type PokemonSpriteKey = (typeof SPRITE_KEYS)[number];

export interface PokemonSprite {
  name: PokemonSpriteKey;
  image: string;
}

export interface PokemonMovement {
  name: string;
  url: string;
}

export interface PokemonStat {
  name: string;
  baseStat: number;
  effort: number;
}

export interface PokemonDetailResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  cries: Cries;
  sprites: Sprites;
  types: Type[];
  moves: MoveElement[];
  stats: Stat3[];
}

export interface Cries {
  latest: string;
}

export interface Sprites {
  front_default: string | null;
  back_default: string | null;
  front_shiny: string | null;
  back_shiny: string | null;
  other: Other;
  versions?: Versions;
}

export interface Versions {
  'generation-iii'?: {
    emerald?: {
      front_default: string | null;
      front_shiny: string | null;
    };
    'firered-leafgreen'?: {
      front_default: string | null;
      back_default: string | null;
      front_shiny: string | null;
      back_shiny: string | null;
    };
    'ruby-sapphire'?: {
      front_default: string | null;
      back_default: string | null;
      front_shiny: string | null;
      back_shiny: string | null;
    };
  };
}

export interface Other {
  'official-artwork': OfficialArtwork;
}

export interface OfficialArtwork {
  front_default: string | null;
}

export interface Type {
  type: {
    name: string;
  };
}

export interface MoveElement {
  move: {
    name: string;
    url: string;
  };
}

export interface Stat3 {
  base_stat: number;
  effort: number;
  stat: Stat4;
}

export interface Stat4 {
  name: string;
  url: string;
}
