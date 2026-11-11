
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../services/carrito';

@Component({
  selector: 'app-pedido',
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.html',
  styleUrl: './pedido.css',
})
export class Pedido {

  nombre: string = '';
  documento: string = '';
  telefono: string = '';
  direccion: string = '';
  correo: string = '';

  constructor(public carrito: CarritoService) {}

  get productos() {
    return this.carrito.productos;
  }

  get total() {
    return this.carrito.obtenerTotal();
  }

  cambiarCantidad(id: string, tipo: string, cantidad: number): void {
    this.carrito.cambiarCantidad(id, tipo, cantidad);
  }

  eliminarProducto(id: string, tipo: string): void {
    this.carrito.eliminarProducto(id, tipo);
  }

  confirmarPedido(): void {
    if (this.productos.length === 0) {
      alert('Agrega productos antes de confirmar tu pedido.');
      return;
    }

    if (
      !this.nombre.trim() ||
      !this.documento.trim() ||
      !this.telefono.trim() ||
      !this.direccion.trim() ||
      !this.correo.trim()
    ) {
      alert('Por favor, completa toda la información del cliente.');
      return;
    }

    alert(
      'Pedido preparado correctamente.\nTotal a pagar: ' +
      this.total.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
      })
    );
  }
}
