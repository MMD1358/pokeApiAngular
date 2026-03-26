import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PokemonListResponse } from '../services/models/pokemon-list-response.model';
import { PokemonType, PokemonTypeKey } from '../services/models/pokemon-type.model';
import {
  Pokemon,
  PokemonDetailResponse,
  PokemonList,
  PokemonMovement,
  PokemonSprite,
  PokemonStat,
  SPRITE_KEYS,
} from '../services/models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokeApiService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  #http = inject(HttpClient);

  getPokemonList(offset: number, limit: number): Observable<PokemonList[]> {
    const params = new HttpParams().set('offset', offset.toString()).set('limit', limit.toString());

    return this.#http.get<PokemonListResponse>(this.apiUrl, { params }).pipe(
      map((response) =>
        response.results.map((pokemon) => ({
          id: this.getPokemonIdFromUrl(pokemon.url),
          name: pokemon.name,
          url: pokemon.url,
        })),
      ),
    );
  }

  getPokemonByName(name: string): Observable<Pokemon> {
    return this.#http.get<PokemonDetailResponse>(`${this.apiUrl}/${name.toLowerCase()}`).pipe(
      map((pokemon) => ({
        id: pokemon.id,
        name: pokemon.name,
        picture: pokemon.sprites.other['official-artwork'].front_default ?? '',
        cry: pokemon.cries.latest ?? '',
        weight: pokemon.weight,
        height: pokemon.height,
        types: this.mapTypes(pokemon),
        sprites: this.mapSprites(pokemon),
        movements: this.mapMovements(pokemon),
        stats: this.mapStats(pokemon),
      })),
    );
  }

  private mapTypes(pokemon: PokemonDetailResponse): PokemonType[] {
    return pokemon.types.map((typeInfo) => {
      const typeName = typeInfo.type.name as PokemonTypeKey;

      return {
        name: typeName,
        icon: this.getTypeIconUrl(typeName),
      };
    });
  }

  private getTypeIconUrl(type: PokemonTypeKey): string {
    return `assets/types/${type}.png`;
  }

  private mapSprites(pokemon: PokemonDetailResponse): PokemonSprite[] {
    return SPRITE_KEYS.map((key) => ({
      name: key,
      image: pokemon.sprites[key],
    })).filter((sprite): sprite is PokemonSprite => sprite.image !== null);
  }

  private mapMovements(pokemon: PokemonDetailResponse): PokemonMovement[] {
    return pokemon.moves.map((move) => ({
      name: move.move.name,
      url: move.move.url,
    }));
  }

  private mapStats(pokemon: PokemonDetailResponse): PokemonStat[] {
    return pokemon.stats.map((stat) => ({
      name: stat.stat.name,
      baseStat: stat.base_stat,
      effort: stat.effort,
    }));
  }

  private getPokemonIdFromUrl(url: string): number {
    const parts = url.split('/').filter((part) => part !== '');
    return Number(parts[parts.length - 1]);
  }
}
