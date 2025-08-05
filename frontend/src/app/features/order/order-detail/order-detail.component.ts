import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../core/interfaces/models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  imports: [DatePipe], // Import du pipe Angular pour le formatage des dates
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent implements OnInit {
  // Objet représentant la commande à afficher
  order?: Order;

  // Total TTC de la commande
  totalTTC: number = 0;

  // Injection du service API et de la route active
  constructor(private api: ApiService, private route: ActivatedRoute) { }

  /**
   * Hook du cycle de vie Angular appelé à l'initialisation du composant.
   * Récupère l'id de la commande dans l'URL, puis charge la commande depuis l'API.
   * Calcule le total TTC de la commande.
   */
  async ngOnInit() {
    // Récupère l'identifiant de la commande depuis l'URL
    const orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    // Charge la commande depuis l'API
    this.order = await this.api.getOrderById(orderId);

    // Calcule le total TTC si la commande et ses produits existent
    if (this.order && this.order.products) {
      this.totalTTC = this.order.products.reduce(
        (sum, p) => sum + Number(p.order_price) * Number(p.order_quantity), 0
      );
    }
  }

  /**
   * Getter pour le montant hors taxes (HT) de la commande.
   * Utilise la méthode utilitaire du service API.
   */
  get totalHT(): number {
    return this.api.getTotalHT(this.totalTTC);
  }

  /**
   * Getter pour le montant de la TVA de la commande.
   * Utilise la méthode utilitaire du service API.
   */
  get tva(): number {
    return this.api.getTVA(this.totalTTC);
  }
}
