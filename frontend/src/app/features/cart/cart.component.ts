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

  onClose() {
    this.linkClicked.emit(); //  Notifie le parent pour fermer le panier
  }

  async loadCart() {
    this.loading = true;
    this.error = undefined;
    try {
      this.cart = await this.api.getCart();
      // Calcule la quantité totale
      this.totalQuantity = this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      this.quantityChanged.emit(this.totalQuantity);
      console.log("roajoute 1")
    } catch (error: any) {
      this.error = error?.message || 'Erreur lors du chargement du panier';
      this.cart = [];
      this.totalQuantity = 0;
      this.quantityChanged.emit(0);
    } finally {
      this.loading = false;
    }
  }

  // ngOnInit() {
  //   // Si utilisateur non connecté, récupère le panier local
  //   const localCart = localStorage.getItem('cart');
  //   try {
  //     this.cart = localCart ? JSON.parse(localCart) : [];
  //   } catch {
  //     this.cart = [];
  //   }
  // }

  // Ajoute un produit au panier
  // addToCart(product: Product) {
  //   this.cart.push(product);
  //   localStorage.setItem('cart', JSON.stringify(this.cart));
  // }

  // Retire un produit du panier
  async removeFromCart(index: number) {
    this.error = undefined;
    this.successMessage = undefined;
    const item = this.cart[index];
    if (!item) return;
    try {
      await this.api.removeProductFromCart(item.product_id);
      // Soit on recharge depuis le back :
      await this.loadCart();
      // soit on met à jour localement : this.cart.splice(index, 1);

      this.successMessage = 'Produit retiré du panier avec succès !';
      this.showSuccess = true;
      setTimeout(() => {
        this.showSuccess = false;
      }, 1000); // durée visible avant le fondu
      setTimeout(() => {
        this.successMessage = '';
      }, 1500); // durée totale avant suppression du message
    } catch (error: any) {
      this.error = error?.message || 'Erreur lors du retrait du produit';
    }
  }

  async clearCart() {
    try {
      await this.api.clearCart();
      await this.loadCart();
      this.successMessage = 'Panier vidé avec succès !';
      this.showSuccess = true;
      setTimeout(() => {
        this.showSuccess = false;
      }, 1000); // durée visible avant le fondu
      setTimeout(() => {
        this.successMessage = '';
      }, 1500); // durée totale avant suppression du message
    } catch (error: any) {
      this.error = error?.message || 'Erreur lors du vidage du panier';
    }
  }

  get totalPrice(): number {
    return this.cart.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);
  }

  onOrder() {

  }
}