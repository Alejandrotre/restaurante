
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
    imports: [CommonModule],
    selector: 'app-inicio',
    styleUrl: './inicio.css',
    templateUrl: './inicio.html',
})
export class Inicio implements OnInit {

    comidaEstrella: any = null;
    bebidaEstrella: any = null;

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.obtenerEspecialidades();
    }

    obtenerEspecialidades(): void {

        forkJoin([

            // Comida fija mediante su ID
            this.http.get<any>(
                'https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772'
            ),

            // Bebida fija mediante su ID
            this.http.get<any>(
                'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=11007'
            )

        ]).subscribe({

            next: (respuesta) => {
                this.comidaEstrella = respuesta[0].meals[0];
                this.bebidaEstrella = respuesta[1].drinks[0];
            },

            error: (error) => {
                console.error('Error al cargar las especialidades:', error);
            }

        });

    }
}
