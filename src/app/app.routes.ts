import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Comidas } from './comidas/comidas';
import { Bebidas } from './bebidas/bebidas';
import { Juego } from './juego/juego';
import { Pedido } from './pedido/pedido';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'comidas', component: Comidas },
  { path: 'bebidas', component: Bebidas },
  { path: 'juego', component: Juego },
  {path: 'pedido', component: Pedido},
  { path: '**', redirectTo: '' }
];