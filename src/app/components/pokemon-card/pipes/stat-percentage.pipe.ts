import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statPercentage',
  standalone: true,
})
export class StatPercentagePipe implements PipeTransform {
  transform(value: number, maxStat: number = 255): number {
    return Math.min((value / maxStat) * 100, 100);
  }
}
