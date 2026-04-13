import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isShiny',
  standalone: true,
})
export class IsShinyPipe implements PipeTransform {
  transform(sprite: { name?: string } | null | undefined): boolean {
    return sprite?.name?.includes('shiny') ?? false;
  }
}
