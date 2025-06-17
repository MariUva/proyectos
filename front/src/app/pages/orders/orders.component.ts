import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  paginatedOrders: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  loading: boolean = true;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrderHistory().subscribe({
      next: (data) => {
        this.orders = data;
        this.paginateOrders();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando historial de pedidos:', err);
        this.loading = false;
      }
    });
  }

  paginateOrders(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedOrders = this.orders.slice(start, end);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.paginateOrders();
  }

  totalPages(): number {
    return Math.ceil(this.orders.length / this.pageSize);
  }

  getPageArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }
}
