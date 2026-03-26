import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokeApiService } from '../../services/poke-api-service';
import { PokemonTypeChipComponent } from '../pokemon-type/pokemon-type';
import { loadPokemon } from './load-pokemon';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule, PokemonTypeChipComponent],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.css',
})
export class PokemonCard {
  private route = inject(ActivatedRoute);
  private pokeApiService = inject(PokeApiService);

  private state = loadPokemon(this.route, this.pokeApiService);

  pokemon = this.state.pokemon;
  loading = this.state.loading;
  error = this.state.error;

  getSpriteLabel(name: string): string {
    switch (name) {
      case 'front_default':
        return 'Delante';
      case 'back_default':
        return 'Detrás';
      case 'front_shiny':
        return '✨ Shiny Delante';
      case 'back_shiny':
        return '✨ Shiny Detrás';
      default:
        return name;
    }
  }

  getStatLabel(name: string): string {
    switch (name) {
      case 'hp':
        return 'HP';
      case 'attack':
        return 'Ataque';
      case 'defense':
        return 'Defensa';
      case 'special-attack':
        return 'Ataque especial';
      case 'special-defense':
        return 'Defensa especial';
      case 'speed':
        return 'Velocidad';
      default:
        return name;
    }
  }

  getStatPercentage(value: number): number {
    const maxStat = 255;
    return Math.min((value / maxStat) * 100, 100);
  }

  isShiny(sprite: { name?: string } | null | undefined): boolean {
    return sprite?.name?.includes('shiny') ?? false;
  }
}
