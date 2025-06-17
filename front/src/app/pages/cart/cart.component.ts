import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total: number = 0;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: data => {
        this.cartItems = data;
        this.total = this.cartItems.reduce(
          (sum, item) => sum + item.product.precio * item.quantity,
          0
        );
      },
      error: err => console.error('Error al cargar el carrito', err)
    });
  }

  removeItem(itemId: number) {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: '¿Estás seguro de que deseas eliminar este producto del carrito?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.cartService.removeFromCart(itemId).subscribe(() => {
          this.loadCart();
          Swal.fire('Eliminado', 'El producto ha sido eliminado del carrito.', 'success');
        });
      }
    });
  }

  clearCart() {
    Swal.fire({
      title: '¿Vaciar carrito?',
      text: '¿Seguro que deseas vaciar todo el carrito?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.cartService.clearCart().subscribe(() => {
          this.loadCart();
          Swal.fire('Carrito vaciado', 'Todos los productos fueron eliminados.', 'success');
        });
      }
    });
  }

  changeQuantity(item: any) {
    Swal.fire({
      title: `Modificar cantidad`,
      text: `Producto: ${item.product.nombre} (Stock: ${item.product.stock})`,
      input: 'number',
      inputLabel: 'Nueva cantidad',
      inputValue: item.quantity,
      inputAttributes: {
        min: '1',
        max: item.product.stock.toString(),
        step: '1'
      },
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: (value) => {
        const cantidad = Number(value);
        if (!cantidad || cantidad < 1) {
          Swal.showValidationMessage('Cantidad inválida');
          return false;
        }
        if (cantidad > item.product.stock) {
          Swal.showValidationMessage(`Solo hay ${item.product.stock} unidades disponibles`);
          return false;
        }
        return cantidad;
      }
    }).then(result => {
      if (result.isConfirmed) {
        const nuevaCantidad = Number(result.value);
        this.cartService.removeFromCart(item.id).subscribe(() => {
          this.cartService.addToCart(item.product.id, nuevaCantidad).subscribe(() => {
            this.loadCart();
            Swal.fire('Actualizado', `Cantidad actualizada a ${nuevaCantidad}`, 'success');
          });
        });
      }
    });
  }

checkout() {
  Swal.fire({
    title: '💳 Procesar pago',
    html: `<p>Total a pagar: <strong>$${this.total.toFixed(0)}</strong></p>`,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Pagar ahora',
    cancelButtonText: 'Cancelar',
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      try {
        const res = await this.orderService.placeOrder().toPromise();
        if (res && res.id) {
          return true;
        }
        return true;
      } catch (error: any) {
        if (error.status === 200 && error.ok === false) {
          return true;
        }
        Swal.showValidationMessage('❌ Error al procesar el pedido.');
        console.error('🛠️ Detalles del error en checkout():', error);
        throw error;
      }
    }
    }).then(result => {
      if (result.isConfirmed) {
        this.loadCart();
        Swal.fire({
          icon: 'success',
          title: '✅ Compra con éxito',
          text: 'Tu pedido ha sido registrado correctamente.',
          timer: 2500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/']);
        });
      }
    });
  }


}
