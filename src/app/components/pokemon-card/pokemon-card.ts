import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Pokemon } from '../../services/models/pokemon.model';
import { PokeApiService } from '../../services/poke-api-service';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule],
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
