import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { Movement } from '../../services/models/movement.model';
import { PokeApiService } from '../../services/poke-api-service';

@Component({
  selector: 'app-pokemon-movement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-movement.html',
  styleUrl: './pokemon-movement.css',
})
export class PokemonMovementComponent {
  private pokeApiService = inject(PokeApiService);

  movementName = input.required<string>();

  opened = signal(false);
  loading = signal(false);
  error = signal(false);
  movement = signal<Movement | null>(null);

  toggle(): void {
    const isOpening = !this.opened();
    this.opened.set(isOpening);

    if (isOpening && !this.movement() && !this.loading()) {
      this.loadMovement();
    }
  }

  private loadMovement(): void {
    this.loading.set(true);
    this.error.set(false);

    this.pokeApiService.getMovementByName(this.movementName()).subscribe({
      next: (movement) => {
        console.log('MOVE LOADED', movement);
        this.movement.set(movement);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('MOVE ERROR', err);
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  formatValue(value: number | null): string {
    return value !== null ? value.toString() : '—';
  }
}
