import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Pokemon } from '../../services/models/pokemon.model';
import { PokeApiService } from '../../services/poke-api-service';

@Component({
  selector: 'app-pokemon-table',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pokemon-table.html',
  styleUrl: './pokemon-table.css',
})
export class PokemonTable implements OnInit {
  pokemons: Pokemon[] = [];
  searchValue: string = '';

  offset: number = 0;
  limit: number = 20;

  constructor(
    private pokeApiService: PokeApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadPokemons(): void {
    this.pokeApiService.getPokemonList(this.offset, this.limit).subscribe({
      next: (data) => {
        this.pokemons = data;
      },
      error: (error) => {
        console.error('Error loading pokemon list:', error);
      },
    });
  }

  nextPage(): void {
    this.offset += this.limit;
    this.loadPokemons();
  }

  previousPage(): void {
    if (this.offset >= this.limit) {
      this.offset -= this.limit;
      this.loadPokemons();
    }
  }

  searchPokemon(): void {
    const value = this.searchValue.trim().toLowerCase();

    if (!value) {
      this.offset = 0;
      this.loadPokemons();
      return;
    }

    this.router.navigate(['/pokemon', value]);
  }
}
