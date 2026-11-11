
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    mensaje = 'Encuentra la comida y la bebida.';

    ngOnInit(): void {
        this.crearCartas();
    }

    crearCartas(): void {

        this.cartas = [];
        for (let i = 0; i < 16; i++) {

            this.cartas.push({
                id: i,
                imagen: '',
                nombre: '',
                tipo: 'vacia',
                volteada: false
            });

        }
        this.cartas[0] = {
            id: 0,
            imagen: 'comida.jpg',
            nombre: 'Comida',
            tipo: 'comida',
            volteada: false
        };

        this.cartas[1] = {
            id: 1,
            imagen: 'bebida.jpg',
            nombre: 'Bebida',
            tipo: 'bebida',
            volteada: false
        };

        this.mezclarCartas();
    }

    mezclarCartas(): void {

        for (let i = this.cartas.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [this.cartas[i], this.cartas[j]] =
                [this.cartas[j], this.cartas[i]];

        }

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

        const encontroComida = this.cartas.some(
            c => c.tipo === 'comida' && c.volteada
        );

        const encontroBebida = this.cartas.some(
            c => c.tipo === 'bebida' && c.volteada
        );

        if (encontroComida && encontroBebida) {

            this.juegoGanado = true;
            this.mensaje = '¡Felicidades! ¡Encontraste las dos imágenes!';

        }

    }
    reiniciarJuego(): void {

        this.juegoGanado = false;
        this.mensaje = 'Encuentra la comida y la bebida.';

        this.crearCartas();

    }

}
