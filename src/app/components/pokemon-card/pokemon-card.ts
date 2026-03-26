import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pokemon } from '../../services/models/pokemon.model';
import { PokeApiService } from '../../services/poke-api-service';
import { PokemonTypeChipComponent } from '../pokemon-type/pokemon-type';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule, PokemonTypeChipComponent],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.css',
})
export class PokemonCard implements OnInit {
  private route = inject(ActivatedRoute);
  private pokeApiService = inject(PokeApiService);

  pokemon = signal<Pokemon | null>(null);
  loading = signal(true);
  error = signal(false);

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

  isShiny(sprite: any): boolean {
    return sprite.name?.includes('shiny');
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }

    this.pokeApiService.getPokemonByName(id).subscribe({
      next: (data) => {
        this.pokemon.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
