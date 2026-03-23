import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokemonTable } from './components/pokemon-table/pokemon-table';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PokemonTable],
  template: `<router-outlet></router-outlet>`,
})
export class App {}
