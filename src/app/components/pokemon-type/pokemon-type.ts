import { Component, Input } from '@angular/core';
import { PokemonType } from '../../services/models/pokemon-type.model';

@Component({
  selector: 'app-pokemon-type-chip',
  template: `
    <div class="type-chip" [attr.data-type]="type.name">
      <img class="type-icon" [src]="type.icon" [alt]="type.name" [title]="type.name" />
    </div>
  `,
  styleUrls: ['./pokemon-type.css'],
})
export class PokemonTypeChipComponent {
  @Input({ required: true }) type!: PokemonType;
}
