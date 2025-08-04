import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../core/interfaces/models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  imports: [DatePipe],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent {
  order?: Order;
  totalTTC: number = 0;

  constructor(private api: ApiService, private route: ActivatedRoute) { }

  async ngOnInit() {
    const orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    this.order = await this.api.getOrderById(orderId);

    if (this.order && this.order.products) {
      this.totalTTC = this.order.products.reduce(
        (sum, p) => sum + Number(p.order_price) * Number(p.order_quantity), 0
      );
    }
  }

  get totalHT(): number {
    return this.api.getTotalHT(this.totalTTC);
  }

  get tva(): number {
    return this.api.getTVA(this.totalTTC);
  }
}
