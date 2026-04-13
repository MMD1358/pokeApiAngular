import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Movement } from '../services/models/movement.model';
import { PokemonType, PokemonTypeKey } from '../services/models/pokemon-type.model';
import { Pokemon, PokemonDetailResponse, PokemonList } from '../services/models/pokemon.model';
import { PokemonListResponse, PokemonMapper } from './pokemon-mapper';

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

interface MoveApiResponse {
  name: string;
  power: number | null;
  accuracy: number | null;
  pp: number | null;
  priority: number;
  effect_entries: Array<{
    effect: string;
    short_effect: string;
    language: {
      name: string;
    };
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class PokeApiService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  private moveApiUrl = 'https://pokeapi.co/api/v2/move';
  #http = inject(HttpClient);

  getPokemonList(offset: number, limit: number): Observable<PokemonList[]> {
    const params = new HttpParams().set('offset', offset.toString()).set('limit', limit.toString());
    return this.#http
      .get<PokemonListResponse>(this.apiUrl, { params })
      .pipe(map((response) => PokemonMapper.mapToList(response)));
  }

  getPokemonByName(name: string): Observable<Pokemon> {
    return this.#http
      .get<PokemonDetailResponse>(`${this.apiUrl}/${name.toLowerCase()}`)
      .pipe(
        switchMap((pokemon) =>
          this.fetchTypeDetails(pokemon).pipe(
            map((types) => PokemonMapper.mapToDetail(pokemon, types)),
          ),
        ),
      );
  }

  getMovementByName(name: string): Observable<Movement> {
    return this.#http.get<MoveApiResponse>(`${this.moveApiUrl}/${name.toLowerCase()}`).pipe(
      map((move) => {
        const englishEffect =
          move.effect_entries.find((entry) => entry.language.name === 'en')?.effect ??
          'No details available.';

        return {
          name: move.name,
          power: move.power,
          accuracy: move.accuracy,
          pp: move.pp,
          priority: move.priority,
          details: englishEffect,
        };
      }),
    );
  }

  private fetchTypeDetails(pokemon: PokemonDetailResponse): Observable<PokemonType[]> {
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
}
