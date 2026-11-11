import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navegacion } from './navegacion/navegacion';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navegacion, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}