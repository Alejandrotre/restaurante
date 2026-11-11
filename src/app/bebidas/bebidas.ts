
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CarritoService } from '../services/carrito';

interface Bebida {
    idDrink: string;
    strDrink: string;
    strDrinkThumb: string;
    strAlcoholic: string;
    strCategory: string;
    ingredientes: string[];
    precio: number;
    cantidadSeleccionada: number;
}

@Component({
    selector: 'app-bebidas',
    imports: [CommonModule, FormsModule],
    templateUrl: './bebidas.html',
    styleUrl: './bebidas.css',
})

export class Bebidas implements OnInit {

    bebidas: Bebida[] = [];
    bebidasFiltradas: Bebida[] = [];

    textoBusqueda: string = '';
    ingredienteBusqueda: string = '';
    tipoSeleccionado: string = '';
    categoriaSeleccionada: string = '';

    cargando: boolean = false;
    mensajeError: string = '';

    preciosAsignados: { [id: string]: number } = {};

    constructor(
        private http: HttpClient,
        private carrito: CarritoService
    ) {}

    ngOnInit(): void {
        this.cargarBebidas();
    }

    cargarBebidas(): void {

        this.cargando = true;
        this.mensajeError = '';

        const letras = 'abcdefghijklmnopqrstuvwxyz'.split('');

        const consultas = letras.map(letra =>
            this.http.get<any>(
                `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letra}`
            ).pipe(
                catchError(error => {
                    console.error('Error al consultar la letra:', letra, error);
                    return of({ drinks: null });
                })
            )
        );

        forkJoin(consultas).subscribe({

            next: (respuestas) => {

                const resultados = respuestas.flatMap(respuesta =>
                    respuesta.drinks ?? []
                );

                const bebidasUnicas = Array.from(
                    new Map(resultados.map((bebida: any) => [
                        bebida.idDrink,
                        bebida
                    ])).values()
                );

                this.bebidas = bebidasUnicas.map((bebida: any) =>
                    this.asignarDatos(bebida)
                );

                this.bebidasFiltradas = [...this.bebidas];

                this.cargando = false;

                if (this.bebidas.length === 0) {
                    this.mensajeError = 'No se encontraron bebidas.';
                }
            },

            error: (error) => {

                console.error('Error al cargar las bebidas:', error);

                this.mensajeError = 'No se pudieron cargar las bebidas.';

                this.cargando = false;
            }
        });
    }

    // Asigna ingredientes y un precio aleatorio
    asignarDatos(bebida: any): Bebida {

        const ingredientes: string[] = [];

        for (let i = 1; i <= 15; i++) {

            const ingrediente = bebida[`strIngredient${i}`];

            if (ingrediente && ingrediente.trim() !== '') {
                ingredientes.push(ingrediente);
            }
        }

        if (!this.preciosAsignados[bebida.idDrink]) {

            this.preciosAsignados[bebida.idDrink] =
                Math.floor(Math.random() * 28 + 8) * 1000;
        }

        return {

            idDrink: bebida.idDrink,
            strDrink: bebida.strDrink,
            strDrinkThumb: bebida.strDrinkThumb,
            strAlcoholic: bebida.strAlcoholic,
            strCategory: bebida.strCategory,
            ingredientes: ingredientes,
            precio: this.preciosAsignados[bebida.idDrink],
            cantidadSeleccionada: 1
        };
    }

    filtrarBebidas(): void {

        const nombre = this.textoBusqueda.trim().toLowerCase();
        const ingrediente = this.ingredienteBusqueda.trim().toLowerCase();

        this.bebidasFiltradas = this.bebidas.filter(bebida => {

            const coincideNombre =
                bebida.strDrink.toLowerCase().includes(nombre);

            const coincideIngrediente =
                bebida.ingredientes.some(item =>
                    item.toLowerCase().includes(ingrediente)
                );

            const coincideTipo =
                this.tipoSeleccionado === '' ||
                bebida.strAlcoholic === this.tipoSeleccionado;

            const coincideCategoria =
                this.categoriaSeleccionada === '' ||
                bebida.strCategory === this.categoriaSeleccionada;

            return coincideNombre &&
                coincideIngrediente &&
                coincideTipo &&
                coincideCategoria;
        });

        this.mensajeError = this.bebidasFiltradas.length === 0
            ? 'No se encontraron bebidas con esos filtros.'
            : '';
    }

    buscarPorNombre(): void {
        this.filtrarBebidas();
    }

    buscarPorIngrediente(): void {
        this.filtrarBebidas();
    }

    cambiarTipo(): void {
        this.filtrarBebidas();
    }

    cambiarCategoria(): void {
        this.filtrarBebidas();
    }

    limpiarFiltros(): void {

        this.textoBusqueda = '';
        this.ingredienteBusqueda = '';
        this.tipoSeleccionado = '';
        this.categoriaSeleccionada = '';

        this.bebidasFiltradas = [...this.bebidas];

        this.mensajeError = '';
    }

    comprarBebida(bebida: Bebida): void {

        const cantidad = Math.floor(bebida.cantidadSeleccionada);

        if (!Number.isFinite(cantidad) || cantidad < 1) {

            alert('Selecciona una cantidad válida.');

            bebida.cantidadSeleccionada = 1;

            return;
        }

        this.carrito.agregarProducto({

            id: bebida.idDrink,
            tipo: 'bebida',
            nombre: bebida.strDrink,
            imagen: bebida.strDrinkThumb,
            precio: bebida.precio,
            cantidad: cantidad

        });

        alert(bebida.strDrink + ' agregado al pedido');

        bebida.cantidadSeleccionada = 1;
    }
}
