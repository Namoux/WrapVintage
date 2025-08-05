import { Component, OnInit } from '@angular/core';
import { CartItem, User } from '../../../core/interfaces/models';
import { ApiService } from '../../../core/services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-summary',
  imports: [FormsModule],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {

  // Injection du service API
  constructor(private api: ApiService) { }

  // Liste des produits du panier
  cart: CartItem[] = [];
  // Informations de l'utilisateur
  user: User = { id: 0, username: '', password: '', email: '', adresse: '', is_admin: 0 };
  // Champ d'édition de l'adresse
  adresseInput = '';
  // Indique si l'adresse est en cours d'édition
  editAdresse = false;

  /**
   * Hook du cycle de vie Angular appelé à l'initialisation du composant.
   * Initialise le panier et les infos utilisateur.
   */
  async ngOnInit() {
    // Souscrit au panier partagé pour mettre à jour la commande en temps réel si le panier change
    this.api.cart$.subscribe(cart => {
      this.cart = cart;
    });
    // Charge le panier au démarrage
    const initialCart = await this.api.getCart();
    this.api.updateCart(initialCart);
    // Récupère les infos utilisateur
    this.user = await this.api.getMe();
    // Initialise le champ adresse
    this.adresseInput = this.user.adresse || '';
  }


  /**
  * Calcule le prix total du panier.
  * @param cart Tableau des produits du panier
  * @returns {number} Le montant total de tous les produits du panier.
  */
  get totalTTC(): number {
    return this.api.getTotalPrice(this.cart);
  }

  /**
   * Calcule le montant hors taxes (HT) du panier.
   * @returns {number} Le montant HT
   */
  get totalHT(): number {
    return this.api.getTotalHT(this.totalTTC);
  }

  /**
   * Calcule le montant de la TVA du panier.
   * @returns {number} Le montant de la TVA
   */
  get tva(): number {
    return this.api.getTVA(this.totalTTC);
  }

  /**
   * Sauvegarde la nouvelle adresse utilisateur.
   */
  async saveAdresse() {
    if (!this.adresseInput.trim()) return;
    await this.api.updateUser(this.user.id, { adresse: this.adresseInput });
    this.user = await this.api.getMe();
    this.editAdresse = false;
  }

  /**
   * Lance le paiement Stripe pour le panier.
   * Crée une session Stripe côté backend puis redirige l'utilisateur vers Stripe Checkout.
   */
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
