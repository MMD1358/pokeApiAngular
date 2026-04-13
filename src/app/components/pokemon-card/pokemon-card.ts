import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pokemon } from '../../services/models/pokemon.model';
import { PokeApiService } from '../../services/poke-api-service';
import { PokemonMovementComponent } from '../pokemon-movement/pokemon-movement';
import { PokemonTypeChipComponent } from '../pokemon-type/pokemon-type';
import { IsShinyPipe } from './pipes/is-shiny.pipe';
import { SpriteLabelPipe } from './pipes/sprite-label.pipe';
import { StatLabelPipe } from './pipes/stat-label.pipe';
import { StatPercentagePipe } from './pipes/stat-percentage.pipe';

function loadPokemon(route: ActivatedRoute, pokeApiService: PokeApiService) {
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

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [
    CommonModule,
    PokemonTypeChipComponent,
    PokemonMovementComponent,
    SpriteLabelPipe,
    StatLabelPipe,
    StatPercentagePipe,
    IsShinyPipe,
  ],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.css',
})
export class PokemonCard {
  private route = inject(ActivatedRoute);
  private pokeApiService = inject(PokeApiService);

  private state = loadPokemon(this.route, this.pokeApiService);
  protected readonly statMax = 255;
  protected readonly movementsPerPage = 10;

  pokemon = this.state.pokemon;
  loading = this.state.loading;
  error = this.state.error;

  currentMovementPage = signal(0);

  paginatedMovements = computed(() => {
    const pokemon = this.pokemon();
    if (!pokemon) return [];

    const start = this.currentMovementPage() * this.movementsPerPage;
    const end = start + this.movementsPerPage;

    return pokemon.movements.slice(start, end);
  });

  totalMovementPages = computed(() => {
    const pokemon = this.pokemon();
    if (!pokemon) return 0;

    return Math.ceil(pokemon.movements.length / this.movementsPerPage);
  });

  nextMovementPage(): void {
    if (this.currentMovementPage() < this.totalMovementPages() - 1) {
      this.currentMovementPage.update((page) => page + 1);
    }
  }

  previousMovementPage(): void {
    if (this.currentMovementPage() > 0) {
      this.currentMovementPage.update((page) => page - 1);
    }
  }
}
