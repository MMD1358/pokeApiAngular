import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
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

@Injectable({
  providedIn: 'root',
})
export class PokeApiService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
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
