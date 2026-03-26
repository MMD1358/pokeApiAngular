import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PokemonType } from '../../services/models/pokemon-type.model';

@Component({
  selector: 'app-pokemon-type-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-type.html',
  styleUrl: './pokemon-type.css',
})
export class PokemonTypeChipComponent {
  @Input({ required: true }) type!: PokemonType;
}
