
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

interface Carta {
    id: number;
    imagen: string;
    nombre: string;
    tipo: string;
    volteada: boolean;
}

@Component({
    selector: 'app-juego',
    imports: [CommonModule],
    templateUrl: './juego.html',
    styleUrl: './juego.css'
})

export class Juego implements OnInit {

    cartas: Carta[] = [];
    juegoGanado = false;
    cargando = true;
    mensaje = 'Encuentra la comida y la bebida.';

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.cargarCartas();
    }

    cargarCartas(): void {

        forkJoin([
            this.http.get<any>('https://www.themealdb.com/api/json/v1/1/random.php'),
            this.http.get<any>('https://www.thecocktaildb.com/api/json/v1/1/random.php')
        ]).subscribe({

            next: (respuestas) => {

                const comida = respuestas[0].meals[0];
                const bebida = respuestas[1].drinks[0];

                this.cartas = [];

                // Crear las 16 cartas
                for (let i = 0; i < 16; i++) {

                    this.cartas.push({
                        id: i,
                        imagen: '',
                        nombre: '',
                        tipo: 'vacia',
                        volteada: false
                    });

                }

                // Agregar la comida
                this.cartas[0] = {
                    id: 0,
                    imagen: comida.strMealThumb,
                    nombre: comida.strMeal,
                    tipo: 'comida',
                    volteada: false
                };

                // Agregar la bebida
                this.cartas[1] = {
                    id: 1,
                    imagen: bebida.strDrinkThumb,
                    nombre: bebida.strDrink,
                    tipo: 'bebida',
                    volteada: false
                };

                this.mezclarCartas();
                this.cargando = false;

            },

            error: () => {
                this.mensaje = 'Error al cargar las imágenes.';
                this.cargando = false;
            }

        });
    }

    mezclarCartas(): void {
        this.cartas.sort(() => Math.random() - 0.5);
    }

    voltearCarta(carta: Carta): void {

        if (carta.volteada || this.juegoGanado) {
            return;
        }

        carta.volteada = true;

        if (carta.tipo === 'comida') {
            this.mensaje = '¡Encontraste la comida!';
        }

        if (carta.tipo === 'bebida') {
            this.mensaje = '¡Encontraste la bebida!';
        }

        if (this.cartas.some(c => c.tipo === 'comida' && c.volteada) &&
            this.cartas.some(c => c.tipo === 'bebida' && c.volteada)) {

            this.juegoGanado = true;
            this.mensaje = '¡Felicidades! ¡Encontraste las dos imágenes!';
        }
    }

    reiniciarJuego(): void {
        this.cargando = true;
        this.juegoGanado = false;
        this.mensaje = 'Encuentra la comida y la bebida.';
        this.cargarCartas();
    }
}
