import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-admin.component.html',
  styleUrls: ['./product-admin.component.css']
})
export class ProductAdminComponent implements OnInit {
  products: Product[] = [];
  form: FormGroup;
  editingId: number | null = null;
  modalVisible = false;
  currentPage = 1;
  itemsPerPage = 5;

  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: data => this.products = data
    });
  }

  openModal(product?: Product) {
    this.modalVisible = true;
    this.form.reset();

    if (product) {
      this.editingId = product.id;
      this.form.patchValue(product);
    } else {
      this.editingId = null;
    }
  }

  closeModal() {
    this.modalVisible = false;
    this.form.reset();
    this.editingId = null;
  }

  save() {
    const product: Product = this.form.value;

    if (this.editingId) {
      this.productService.update(this.editingId, product).subscribe(() => {
        this.loadProducts();
        this.closeModal();
        Swal.fire('Actualizado', 'El producto fue actualizado exitosamente', 'success');
      });
    } else {
      this.productService.create(product).subscribe(() => {
        this.loadProducts();
        this.closeModal();
        Swal.fire('Guardado', 'El producto fue creado exitosamente', 'success');
      });
    }
  }

  confirmDelete(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.delete(id).subscribe(() => {
          this.loadProducts();
          Swal.fire('Eliminado', 'El producto ha sido eliminado', 'success');
        });
      }
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

}
