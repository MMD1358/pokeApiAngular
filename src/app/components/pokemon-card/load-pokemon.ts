import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pokemon } from '../../services/models/pokemon.model';
import { PokeApiService } from '../../services/poke-api-service';

export function loadPokemon(route: ActivatedRoute, pokeApiService: PokeApiService) {
  const pokemon = signal<Pokemon | null>(null);
  const loading = signal(true);
  const error = signal(false);

  const id = route.snapshot.paramMap.get('id');

  if (!id) {
    error.set(true);
    loading.set(false);

    return {
      pokemon,
      loading,
      error,
    };
  }

  pokeApiService.getPokemonByName(id).subscribe({
    next: (data) => {
      pokemon.set(data);
      loading.set(false);
    },
    error: () => {
      error.set(true);
      loading.set(false);
    },
  });

  return {
    pokemon,
    loading,
    error,
  };
}
