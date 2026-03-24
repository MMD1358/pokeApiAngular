import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { PokemonType } from '../services/models/pokemon-type.model';
import {
  Pokemon,
  PokemonMovement,
  PokemonSprite,
  Root,
  SPRITE_KEYS,
} from '../services/models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokeApiService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  getPokemonList(offset: number, limit: number): Observable<Pokemon[]> {
    return this.http
      .get<{
        results: { name: string; url: string }[];
        //todo cambiar el offset y limit de la url y ponerlo con query params
      }>(`${this.apiUrl}?offset=${offset}&limit=${limit}`)
      .pipe(
        map((response) =>
          response.results.map((pokemon) => ({
            id: this.getPokemonIdFromUrl(pokemon.url),
            name: pokemon.name,
            picture: '',
            cry: '',
            weight: 0,
            height: 0,
            types: [],
            sprites: [],
            movements: [],
          })),
        ),
      );
  }

  getPokemonByName(name: string): Observable<Pokemon> {
    return this.http.get<Root>(`${this.apiUrl}/${name.toLowerCase()}`).pipe(
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
      })),
    );
  }

  getPokemonMovements(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${name}`);
  }

  private mapTypes(pokemon: Root): PokemonType[] {
    return pokemon.types.map((type) => ({
      name: type.type.name as PokemonType['name'],
      sprite: type.type.name as PokemonType['sprite'],
    }));
  }

  private mapSprites(pokemon: Root): PokemonSprite[] {
    return SPRITE_KEYS.map((key) => ({
      name: key,
      image: pokemon.sprites[key],
    })).filter((sprite): sprite is PokemonSprite => sprite.image !== null);
  }

  private mapMovements(pokemon: Root): PokemonMovement[] {
    return pokemon.moves.map((move) => ({
      name: move.move.name,
      url: move.move.url,
    }));
  }

  private getPokemonIdFromUrl(url: string): number {
    const parts = url.split('/').filter((part) => part !== '');
    return Number(parts[parts.length - 1]);
  }
}
