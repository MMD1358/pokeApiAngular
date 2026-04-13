import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spriteLabel',
  standalone: true,
})
export class SpriteLabelPipe implements PipeTransform {
  transform(name: string): string {
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
}
