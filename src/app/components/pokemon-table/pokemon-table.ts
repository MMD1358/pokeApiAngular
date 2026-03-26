import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PokemonList } from '../../services/models/pokemon.model';
import { PokeApiService } from '../../services/poke-api-service';

@Component({
  selector: 'app-pokemon-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pokemon-table.html',
  styleUrl: './pokemon-table.css',
})
export class PokemonTable implements OnInit {
  private pokeApiService = inject(PokeApiService);

  pokemons = signal<PokemonList[]>([]);
  allPokemons = signal<PokemonList[]>([]);
  searchValue = signal('');

  offset = signal(0);
  limit = 20;

  hasPrevious = computed(() => this.offset() > 0);

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadPokemons(): void {
    this.pokeApiService.getPokemonList(this.offset(), this.limit).subscribe({
      next: (data) => {
        this.allPokemons.set(data);
        this.pokemons.set(data);
        this.searchValue.set('');
      },
      error: (error) => {
        console.error('Error loading pokemon list:', error);
      },
    });
  }

  nextPage(): void {
    this.offset.update((value) => value + this.limit);
    this.loadPokemons();
  }

  previousPage(): void {
    if (this.hasPrevious()) {
      this.offset.update((value) => value - this.limit);
      this.loadPokemons();
    }
  }

  updateSearch(value: string): void {
    this.searchValue.set(value);

    const text = value.trim().toLowerCase();

    if (!text) {
      this.pokemons.set(this.allPokemons());
      return;
    }

    const filteredPokemons = this.allPokemons().filter((pokemon) =>
      pokemon.name.toLowerCase().includes(text),
    );
    console.log(this.pokemons(), this.allPokemons());
    this.pokemons.set(filteredPokemons);
  }
}
