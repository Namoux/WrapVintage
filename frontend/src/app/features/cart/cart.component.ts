import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartItem } from '../../core/interfaces/models';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  @Input() isCopen = false; // Reçoit l'état depuis le parent via Input (HeaderComponent)
  @Output() linkClicked = new EventEmitter<void>(); //  Ajout de l'événement
  @Output() quantityChanged = new EventEmitter<number>();

  cart: CartItem[] = [];
  loading = false;
  successMessage?: string;
  showSuccess = false;
  error?: string;
  totalQuantity = 0;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadCart();
  }

  onClose() {
    this.linkClicked.emit(); //  Notifie le parent pour fermer le panier
  }

  /**
 * Charge le panier du client.
 * 
 * - Si l'utilisateur est connecté, récupère le panier côté serveur via l'API.
 * - Si l'utilisateur n'est pas connecté (erreur 401), récupère le panier local (stocké en cookie).
 * - En cas d'erreur technique, vide le panier et affiche un message d'erreur.
 * 
 * Met à jour la quantité totale et émet un événement pour le parent.
 */
  async loadCart() {
    this.loading = true;
    this.error = undefined;

    try {
      // On tente de récupérer l'utilisateur connecté
      const user = await this.api.getMe();

      if (user) {
        // Utilisateur connecté → panier côté serveur
        this.cart = await this.api.getCart();
      }

    } catch (error: any) {
      if (error.status === 401) {
        // Non authentifié → panier côté cookie
        this.cart = this.api.getCookieCart();
      } else {
        // Autres erreurs (réseau, serveur, etc.)
        this.error = error?.message || 'Erreur lors du chargement du panier';
        this.cart = [];
      }
    } finally {
      // Calcule la quantité totale (0 si panier vide)
      this.totalQuantity = this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      this.quantityChanged.emit(this.totalQuantity);
      this.loading = false;
    }
  }

  /**
   * Retire un produit du panier.
   * 
   * - Si l'utilisateur est connecté, retire le produit côté serveur puis recharge le panier.
   * - Si l'utilisateur n'est pas connecté, retire le produit du panier local (cookie) et met à jour la quantité.
   * 
   * Affiche un message de succès ou d'erreur selon le résultat.
   * @param index Index du produit à retirer dans le tableau cart.
   */
  async removeFromCart(index: number) {
    this.error = undefined;
    this.successMessage = undefined;

    const item = this.cart[index];
    if (!item) return;

    try {
      // Vérifie si utilisateur est connecté via getMe()
      const user = await this.api.getMe();

      if (user) {
        // Utilisateur connecté → suppression côté serveur
        await this.api.removeProductFromCart(item.product_id);
        await this.loadCart(); // recharge panier depuis serveur

        // Message de succès
        this.successMessage = 'Produit supprimé avec succès !';
        this.showSuccess = true;
        setTimeout(() => { this.showSuccess = false; }, 1000);
        setTimeout(() => { this.successMessage = ''; }, 1500);
      }

    } catch (error: any) {
      if (error.status === 401) {
        // Non authentifié → suppression côté cookie
        console.log("non authentifié, retrait du produit dans le cookie");
        this.removeFromCookieCart(index);

        // Message de succès
        this.successMessage = 'Produit supprimé avec succès !';
        this.showSuccess = true;
        setTimeout(() => { this.showSuccess = false; }, 1000);
        setTimeout(() => { this.successMessage = ''; }, 1500);
      } else {
        console.log("Erreur lors du retrait du produit");
        this.error = error?.message || 'Erreur lors du retrait du produit';
      }
    }
  }

  /**
 * Retire un produit du panier local (cookie) du visiteur.
 * 
 * Met à jour le cookie, la quantité totale, émet l'événement de quantité
 * et affiche un message de succès.
 * 
 * @param index Index du produit à retirer dans le tableau cart.
 */
  private removeFromCookieCart(index: number) {
    // Supprime l'item de l'array locale
    this.cart.splice(index, 1);

    // Met à jour le cookie avec le nouveau panier
    this.api.setCookieCart(this.cart);

    // Met à jour la quantité totale et émet l'event
    this.totalQuantity = this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    this.quantityChanged.emit(this.totalQuantity);

  }

  /**
   * Vide le panier.
   * 
   * - Si l'utilisateur est connecté, vide le panier côté serveur puis recharge le panier.
   * - Si l'utilisateur n'est pas connecté, vide le panier local (cookie) et met à jour la quantité.
   * 
   * Affiche un message de succès ou d'erreur selon le résultat.
   */
  async clearCart() {
    this.error = undefined;
    try {
      const user = await this.api.getMe();

      if (user) {
        // Utilisateur connecté → vider panier serveur
        await this.api.clearCart();
        await this.loadCart();

        // Message de succès
        this.successMessage = 'Panier vidé avec succès !';
        this.showSuccess = true;
        setTimeout(() => { this.showSuccess = false; }, 1000);
        setTimeout(() => { this.successMessage = ''; }, 1500);
      }

    } catch (error: any) {
      if (error.status === 401) {
        // Non authentifié → vider panier cookie
        console.log("non authentifié, vidage du panier dans le cookie");
        this.clearCookieCart();

        // Message de succès
        this.successMessage = 'Panier vidé avec succès !';
        this.showSuccess = true;
        setTimeout(() => { this.showSuccess = false; }, 1000);
        setTimeout(() => { this.successMessage = ''; }, 1500);
      } else {
        console.log("Erreur lors du vidage du panier");
        this.error = error?.message || 'Erreur lors du vidage du panier';
      }
    }
  }

  /**
 * Vide le panier local (cookie) du visiteur.
 * 
 * Réinitialise le tableau du panier, la quantité totale,
 * met à jour le cookie, émet l'événement de quantité et affiche un message de succès.
 */
  private clearCookieCart() {
    this.cart = [];
    this.totalQuantity = 0;
    this.api.setCookieCart(this.cart);
    this.quantityChanged.emit(0);
  }

  /**
 * Calcule le prix total du panier.
 * 
 * @returns {number} Le montant total de tous les produits du panier.
 */
  get totalPrice(): number {
    return this.cart.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);
  }

  onOrder() {

  }
}