import { Routes } from '@angular/router';
import { PokemonCard } from './components/pokemon-card/pokemon-card';
import { PokemonTable } from './components/pokemon-table/pokemon-table';

export const routes: Routes = [
  { path: '', component: PokemonTable },
  { path: 'pokemon/:id', component: PokemonCard },
];
