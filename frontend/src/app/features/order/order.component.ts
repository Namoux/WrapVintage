import { Component, OnInit } from '@angular/core';
import { CartItem, User } from '../../core/interfaces/models';
import { ApiService } from '../../core/services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order',
  imports: [FormsModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(private api: ApiService) { }

  cart: CartItem[] = [];
  user: User = { id: 0, username: '', password: '', email: '', adresse: '', is_admin: 0 };
  adresseInput = '';
  editAdresse = false;

  async ngOnInit() {
    // Souscrit au panier partagé pour mettre à jour la commande en temps réel si le panier change
    this.api.cart$.subscribe(cart => {
      this.cart = cart;
    });
    // Charge le panier au démarrage
    const initialCart = await this.api.getCart();
    this.api.updateCart(initialCart);
    this.user = await this.api.getMe();
    this.adresseInput = this.user.adresse || '';
  }


  /**
* Calcule le prix total du panier.
* @param cart Tableau des produits du panier
* @returns {number} Le montant total de tous les produits du panier.
*/
  get totalPrice(): number {
    return this.api.getTotalPrice(this.cart);
  }

  async saveAdresse() {
    if (!this.adresseInput.trim()) return;
    await this.api.updateUser(this.user.id, { adresse: this.adresseInput });
    this.user = await this.api.getMe();
    this.editAdresse = false;
  }

  async onPay() {
    // Appelle ton backend pour créer une session Stripe
    try {
      const { sessionId } = await this.api.createStripeSession(this.cart, this.user);
      // On reçoit SessionId du back et du coup redirige vers Stripe Checkout
      // Initialise Stripe.js avec la clé publique Stripe (clé commençant par pk_)
      // Stripe.js doit être chargé dans index.html pour que window.Stripe soit disponible
      const stripe = (window as any).Stripe('pk_test_51RqZlyHzhcSqHsruPjVy9XVXOITrF28BSjyX5fUJ7q2ZQTwUPBjxu9mauXNU3sAY0cdJeKDhkSNcB8sDY7QJdIWQ00pp1r3vsq'); // Remplace par ta clé publique Stripe
      // Redirige l'utilisateur vers la page de paiement Stripe Checkout avec l'id de session reçu du backend
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      alert('Erreur lors du paiement');
      console.error(error);
    }
  }
}
