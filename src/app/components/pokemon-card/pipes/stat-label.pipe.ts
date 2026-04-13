import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statLabel',
  standalone: true,
})
export class StatLabelPipe implements PipeTransform {
  transform(name: string): string {
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
}
