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
  // Constructeur : injection des services API et routeur
  constructor(private api: ApiService, private route: ActivatedRoute) { }

  // Identifiant de la commande à afficher
  orderId?: number;

  // Indique si la commande est un succès ou non
  isSuccess = false;

  /**
   * Initialise le composant.
   * Si la route est "success", récupère l'utilisateur, la dernière commande et vide le panier.
   */
  async ngOnInit() {
    // Vérifie si la route correspond à la confirmation de succès
    this.isSuccess = this.route.snapshot.routeConfig?.path === 'success';
    if (this.isSuccess) {
      // Récupère l'utilisateur connecté
      const user = await this.api.getMe();
      // Récupère la dernière commande de l'utilisateur
      const order = await this.api.getLastOrder(user.id);
      this.orderId = order?.id;
      // Vide le panier après la commande
      await this.api.clearCart();
    }
  }
}