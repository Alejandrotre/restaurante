
import {
    Component,
    OnInit,
    ChangeDetectorRef
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../services/carrito';

interface Comida {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    precio: number;
    ingredientes: string[];
    cargandoIngredientes: boolean;
    cantidadSeleccionada: number;
}

@Component({
    selector: 'app-comidas',
    imports: [CommonModule, FormsModule],
    templateUrl: './comidas.html',
    styleUrl: './comidas.css'
})

export class Comidas implements OnInit {

    comidas: Comida[] = [];

    textoBusqueda = '';
    ingredienteBusqueda = '';

    cargando = false;
    mensajeError = '';

    preciosAsignados: { [id: string]: number } = {};

    ingredientesVisibles: { [id: string]: boolean } = {};

    constructor(
        private http: HttpClient,
        private cd: ChangeDetectorRef,
        private carrito: CarritoService
    ) {}

    ngOnInit(): void {
        this.cargarComidas();
    }

    cargarComidas(): void {

        const url =
            'https://www.themealdb.com/api/json/v1/1/search.php?s=';

        this.consultarComidas(url);
    }

    obtenerIngredientes(comida: any): string[] {

        const ingredientes: string[] = [];

        for (let i = 1; i <= 20; i++) {

            const ingrediente = comida['strIngredient' + i];

            if (ingrediente && ingrediente.trim() !== '') {
                ingredientes.push(ingrediente);
            }
        }

        return ingredientes;
    }
    asignarPrecios(lista: any[]): Comida[] {

        return lista.map((comida) => {

            if (this.preciosAsignados[comida.idMeal] === undefined) {

                this.preciosAsignados[comida.idMeal] =
                    Math.floor(Math.random() * 34 + 12) * 1000;
            }

            return {

                idMeal: comida.idMeal,
                strMeal: comida.strMeal,
                strMealThumb: comida.strMealThumb,

                precio: this.preciosAsignados[comida.idMeal],

                ingredientes: comida.strIngredient1 !== undefined
                    ? this.obtenerIngredientes(comida)
                    : [],

                cargandoIngredientes: false,

                cantidadSeleccionada: 1
            };
        });
    }

    mostrarIngredientes(idMeal: string): void {

        this.ingredientesVisibles[idMeal] =
            !this.ingredientesVisibles[idMeal];

        if (!this.ingredientesVisibles[idMeal]) {
            return;
        }

        const comida = this.comidas.find(
            plato => plato.idMeal === idMeal
        );

        if (
            !comida ||
            comida.ingredientes.length > 0 ||
            comida.cargandoIngredientes
        ) {
            return;
        }

        comida.cargandoIngredientes = true;

        this.cd.detectChanges();

        const url =
            'https://www.themealdb.com/api/json/v1/1/lookup.php?i='
            + idMeal;

        this.http.get<any>(url).subscribe({

            next: (respuesta) => {

                const detalle = respuesta.meals?.[0];

                if (detalle) {
                    comida.ingredientes =
                        this.obtenerIngredientes(detalle);
                }

                comida.cargandoIngredientes = false;

                this.cd.detectChanges();
            },

            error: (error) => {

                console.error('Error al cargar ingredientes:', error);

                comida.cargandoIngredientes = false;

                this.cd.detectChanges();
            }
        });
    }

    consultarComidas(url: string): void {

        this.cargando = true;
        this.mensajeError = '';

        this.comidas = [];
        this.ingredientesVisibles = {};

        this.cd.detectChanges();

        this.http.get<any>(url).subscribe({

            next: (respuesta) => {

                const resultados = respuesta.meals ?? [];

                this.comidas = this.asignarPrecios(resultados);

                if (this.comidas.length === 0) {

                    this.mensajeError =
                        'No se encontraron comidas. Intenta con otra búsqueda.';
                }

                this.cargando = false;

                this.cd.detectChanges();
            },

            error: (error) => {

                console.error('Error al consultar comidas:', error);

                this.comidas = [];

                this.mensajeError =
                    'No se pudieron cargar las comidas. Intenta nuevamente.';

                this.cargando = false;

                this.cd.detectChanges();
            }
        });
    }

    buscarPorNombre(): void {

        const busqueda = this.textoBusqueda.trim();

        if (busqueda === '') {

            this.mensajeError =
                'Escribe el nombre de una comida.';

            return;
        }

        const url =
            'https://www.themealdb.com/api/json/v1/1/search.php?s='
            + encodeURIComponent(busqueda);

        this.consultarComidas(url);
    }

    buscarPorIngrediente(): void {

        const busqueda = this.ingredienteBusqueda.trim();

        if (busqueda === '') {

            this.mensajeError =
                'Escribe un ingrediente.';

            return;
        }

        const ingrediente = busqueda
            .toLowerCase()
            .replace(/\s+/g, '_');

        const url =
            'https://www.themealdb.com/api/json/v1/1/filter.php?i='
            + encodeURIComponent(ingrediente);

        this.consultarComidas(url);
    }
    comprarComida(comida: Comida): void {

        const cantidad = Math.floor(comida.cantidadSeleccionada);

        if (!Number.isFinite(cantidad) || cantidad < 1) {

            alert('Selecciona una cantidad válida.');

            comida.cantidadSeleccionada = 1;

            return;
        }

        this.carrito.agregarProducto({

            id: comida.idMeal,
            tipo: 'comida',
            nombre: comida.strMeal,
            imagen: comida.strMealThumb,
            precio: comida.precio,
            cantidad: cantidad

        });

        alert(comida.strMeal + ' agregado al pedido');

        comida.cantidadSeleccionada = 1;
    }
}
