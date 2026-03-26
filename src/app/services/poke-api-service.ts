import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
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

interface PokemonTypeApiResponse {
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
      switchMap((pokemon) =>
        this.mapTypes(pokemon).pipe(
          map((types) => ({
            id: pokemon.id,
            name: pokemon.name,
            picture: pokemon.sprites.other['official-artwork'].front_default ?? '',
            cry: pokemon.cries.latest ?? '',
            weight: pokemon.weight,
            height: pokemon.height,
            types,
            sprites: this.mapSprites(pokemon),
            movements: this.mapMovements(pokemon),
            stats: this.mapStats(pokemon),
          })),
        ),
      ),
    );
  }

  private mapTypes(pokemon: PokemonDetailResponse): Observable<PokemonType[]> {
    const typeRequests = pokemon.types.map((typeInfo) =>
      this.#http.get<PokemonTypeApiResponse>(typeInfo.type.url).pipe(
        map((typeResponse) => ({
          name: typeInfo.type.name as PokemonTypeKey,
          icon: typeResponse.sprites?.['generation-iii']?.emerald?.name_icon ?? '',
        })),
      ),
    );

    return forkJoin(typeRequests);
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
