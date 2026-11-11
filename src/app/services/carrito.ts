
import { Injectable } from '@angular/core';

export interface ProductoPedido {
    id: string;
    tipo: string;
    nombre: string;
    imagen: string;
    precio: number;
    cantidad: number;
}

@Injectable({
    providedIn: 'root'
})
export class CarritoService {

    private clave = 'pedidoManila';

    private cargarProductos(): ProductoPedido[] {

        if (typeof localStorage === 'undefined') {
            return [];
        }

        const datos = localStorage.getItem(this.clave);

        return datos ? JSON.parse(datos) : [];
    }

    productos: ProductoPedido[] = this.cargarProductos();

    private guardarProductos(): void {

        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(
                this.clave,
                JSON.stringify(this.productos)
            );
        }
    }

    // Agregar producto al carrito
    agregarProducto(producto: ProductoPedido): void {

        const existente = this.productos.find(
            item => item.id === producto.id &&
                    item.tipo === producto.tipo
        );

        if (existente) {

            existente.cantidad += producto.cantidad;

        } else {

            this.productos.push({ ...producto });

        }

        this.guardarProductos();
    }

    // Eliminar producto
    eliminarProducto(id: string, tipo: string): void {

        this.productos = this.productos.filter(
            item => !(item.id === id && item.tipo === tipo)
        );

        this.guardarProductos();
    }

    // Cambiar cantidad
    cambiarCantidad(
        id: string,
        tipo: string,
        cantidad: number
    ): void {

        const producto = this.productos.find(
            item => item.id === id && item.tipo === tipo
        );

        if (producto && cantidad >= 1) {

            producto.cantidad = cantidad;

            this.guardarProductos();
        }
    }

    // Calcular total
    obtenerTotal(): number {

        return this.productos.reduce(
            (total, producto) =>
                total + producto.precio * producto.cantidad,
            0
        );
    }

    // Vaciar carrito
    vaciarCarrito(): void {

        this.productos = [];

        this.guardarProductos();
    }
}
