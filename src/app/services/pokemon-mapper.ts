import { PokemonType } from './models/pokemon-type.model';
import {
  Pokemon,
  PokemonDetailResponse,
  PokemonList,
  PokemonMovement,
  PokemonSprite,
  PokemonStat,
  SPRITE_KEYS,
  Sprites,
} from './models/pokemon.model';

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}

export class PokemonMapper {
  static mapToList(response: PokemonListResponse): PokemonList[] {
    return response.results.map((pokemon) => ({
      id: this.extractIdFromUrl(pokemon.url),
      name: pokemon.name,
      url: pokemon.url,
    }));
  }

  static mapToDetail(pokemon: PokemonDetailResponse, types: PokemonType[]): Pokemon {
    return {
      id: pokemon.id,
      name: pokemon.name,
      picture: pokemon.sprites.other['official-artwork'].front_default ?? '',
      cry: pokemon.cries.latest ?? '',
      weight: pokemon.weight,
      height: pokemon.height,
      types: types,
      sprites: this.mapSprites(pokemon.sprites),
      movements: this.mapMovements(pokemon),
      stats: this.mapStats(pokemon),
    };
  }

  private static mapSprites(sprites: Sprites): PokemonSprite[] {
    return SPRITE_KEYS.map((key) => ({
      name: key,
      image: sprites[key as keyof Sprites] as string,
    })).filter((sprite) => sprite.image !== null);
  }

  private static mapMovements(pokemon: PokemonDetailResponse): PokemonMovement[] {
    return pokemon.moves.map((moveElement) => ({
      name: moveElement.move.name,
      url: moveElement.move.url,
    }));
  }

  private static mapStats(pokemon: PokemonDetailResponse): PokemonStat[] {
    return pokemon.stats.map((stat3) => ({
      name: stat3.stat.name,
      baseStat: stat3.base_stat,
      effort: stat3.effort,
    }));
  }

  private static extractIdFromUrl(url: string): number {
    const parts = url.split('/').filter((part) => part !== '');
    return Number(parts[parts.length - 1]);
  }
}
