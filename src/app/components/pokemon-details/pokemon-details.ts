import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { Movement } from '../../services/models/movement.model';
import { PokeApiService } from '../../services/poke-api-service';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-details.html',
  styleUrl: './pokemon-details.css',
})
export class PokemonDetailsComponent {
  private pokeApiService = inject(PokeApiService);

  movementName = input.required<string>();

  loading = signal(false);
  error = signal(false);
  movement = signal<Movement | null>(null);

  onToggle(event: Event): void {
    const details = event.target as HTMLDetailsElement;

    if (details.open && !this.movement() && !this.loading()) {
      this.loadMovement();
    }
  }

  private loadMovement(): void {
    this.loading.set(true);
    this.error.set(false);

    this.pokeApiService.getMovementByName(this.movementName()).subscribe({
      next: (movement) => {
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
