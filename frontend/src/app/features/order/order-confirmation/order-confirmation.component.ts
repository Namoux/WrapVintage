import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  imports: [RouterModule], 
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  constructor(private api: ApiService, private route: ActivatedRoute) { }
  orderId?: number;
  isSuccess = false;

  async ngOnInit() {
    this.isSuccess = this.route.snapshot.routeConfig?.path === 'success';
    if (this.isSuccess) {
      const user = await this.api.getMe();
      const order = await this.api.getLastOrder(user.id);
      this.orderId = order?.id;
      await this.api.clearCart();
    }
  }
}