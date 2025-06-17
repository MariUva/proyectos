import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentPage = 1;
  itemsPerPage = 4;

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.cartService.getCart().subscribe();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: data => {
        // Ordena por nombre alfabéticamente
        this.products = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
      },
      error: err => console.error('Error cargando productos', err)
    });
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.products.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }

  changePage(direction: number) {
    this.currentPage += direction;
  }

 addToCart(product: Product) {
  Swal.fire({
      title: `Añadir "${product.nombre}"`,
      text: `Stock disponible: ${product.stock} unidades`,
      input: 'number',
      inputLabel: '¿Cuántas unidades deseas agregar?',
      inputValue: 1,
      inputAttributes: {
        min: '1',
        max: product.stock.toString(), // limita a lo que hay en stock
        step: '1'
      },
      showCancelButton: true,
      confirmButtonText: 'Añadir al carrito',
      cancelButtonText: 'Cancelar',
      preConfirm: (cantidad) => {
        const cantidadNum = Number(cantidad);
        if (!cantidad || cantidadNum < 1 || cantidadNum > product.stock) {
          Swal.showValidationMessage(`Ingresa una cantidad entre 1 y ${product.stock}`);
          return false;
        }
        return cantidadNum;
      }
    }).then(result => {
      if (result.isConfirmed) {
        const cantidad = Number(result.value);
        this.cartService.addToCart(product.id, cantidad).subscribe({
          next: () => {
            Swal.fire('Añadido', `Se agregaron ${cantidad} unidades de "${product.nombre}" al carrito`, 'success');
            this.loadProducts();
            this.cartService.getCart().subscribe();
          },
          error: () => Swal.fire('Error', 'No se pudo añadir al carrito', 'error')
        });
      }
    });
  }

}
