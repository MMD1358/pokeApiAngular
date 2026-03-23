import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Pokemon } from '../services/models/pokemon.model';

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
      }>(`${this.apiUrl}?offset=${offset}&limit=${limit}`)
      .pipe(
        map((response) =>
          response.results.map((pokemon) => ({
            id: this.getPokemonIdFromUrl(pokemon.url),
            name: pokemon.name,
            picture: '',
            cry: '',
            types: [],
            weight: 0,
            height: 0,
            sprites: [],
            movements: [],
          })),
        ),
      );
  }

  getPokemonByName(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${name}`);
  }

  getPokemonMovements(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${name}`);
  }

  private getPokemonIdFromUrl(url: string): number {
    const parts = url.split('/').filter((part) => part !== '');
    return Number(parts[parts.length - 1]);
  }
}
