import { Injectable } from '@angular/core';
import { CartItem, EditUser, Product, User, Order, ContactMessage } from '../interfaces/models';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor() { }

  /**
   * Fonction utilitaire pour parser la réponse et gérer les erreurs HTTP
   * @param response - Réponse HTTP de fetch
   * @returns Données parsées ou lève une erreur avec le message du backend
   */
  private async handleResponse(response: Response): Promise<any> {
    // Tente de parser la réponse en JSON, retourne un objet vide si erreur
    const data = await response.json().catch(() => ({}));
    // Si le code HTTP n'est pas OK (200-299), lève une erreur avec le message du backend (json)
    if (!response.ok) {
      const error = new Error(data?.error || response.statusText);
      (error as any).status = response.status;
      (error as any).body = data;
      throw error;
    }
    // Sinon, retourne les données parsées
    return data;
  }

  /**
   * Récupère tous les produits (limite par défaut à 100)
   */
  public async getProducts(limit: number = 100): Promise<Product[]> {
    // Envoie une requête pour récupérer les produits
    const response = await fetch(`${environment.baseURL}/products/all` + limit);
    // Utilise la fonction utilitaire pour parser la réponse et gérer les erreurs
    return this.handleResponse(response);
  }

  /**
   * Récupère les produits hommes
   */
  public async getManProducts(): Promise<Product[]> {
    // Envoie une requête pour récupérer les produits hommes
    const response = await fetch(`${environment.baseURL}/products/hommes?limit=100`)
    return this.handleResponse(response);
  };

  /**
   * Récupère les produits femmes
   */
  public async getWomanProducts(): Promise<Product[]> {
    // Envoie une requête pour récupérer les produits femmes
    const response = await fetch(`${environment.baseURL}/products/femmes?limit=100`)
    return this.handleResponse(response);
  };

  /**
   * Récupère les nouveautés produits
   */
  public async getProductsNews(): Promise<Product[]> {
    // Envoie une requête pour récupérer les nouveautés
    const response = await fetch(`${environment.baseURL}/products/news?limit=100`);
    return this.handleResponse(response);
  };

  /**
   * Récupère un produit par son id
   */
  public async getProductbyId(id: number): Promise<Product> {
    // Envoie une requête pour récupérer un produit spécifique
    const response = await fetch(`${environment.baseURL}/products/` + id)
    const data = await this.handleResponse(response);
    return data[0]; // renvoie directement l'objet
  };

  /**
   * Recherche des produits par requête
   */
  public async getSearchProduct(query: string): Promise<Product[]> {
    // Envoie une requête pour rechercher des produits
    const response = await fetch(`${environment.baseURL}/products/search/` + query)
    return this.handleResponse(response);
  };

  /**
   * Connexion utilisateur
   */
  public async login(username: string, password: string): Promise<User> {
    // Envoie une requête de connexion
    const response = await fetch(`${environment.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "username": username, "password": password }),
      credentials: 'include' // Permet d'envoyer et de recevoir les cookies
    });

    return this.handleResponse(response);
  };

  /**
   * Récupère les infos de l'utilisateur connecté
   */
  public async getMe(): Promise<User> {
    // Envoie une requête pour récupérer l'utilisateur courant
    const response = await fetch(`${environment.baseURL}/auth/me`, {
      method: 'GET',
      credentials: 'include' // envoyer le cookie
    });

    return this.handleResponse(response);
  };

  /**
   * Déconnexion utilisateur
   */
  public async logout(): Promise<void> {
    // Envoie une requête de déconnexion
    const response = await fetch(`${environment.baseURL}/auth/logout`, {
      method: 'POST',
      credentials: 'include' // Important pour supprimer le cookie
    });

    return this.handleResponse(response);
  };

  /**
   * Met à jour les infos utilisateur
   */
  public async updateUser(id: number, user: EditUser): Promise<any> {
    // Envoie une requête pour mettre à jour l'utilisateur
    const response = await fetch(`${environment.baseURL}/users/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
      credentials: 'include'
    });

    return this.handleResponse(response);

  };

  /**
   * Supprime (soft delete) un utilisateur
   */
  public async deleteUser(id: number): Promise<any> {
    // Envoie une requête pour supprimer l'utilisateur
    const response = await fetch(`${environment.baseURL}/users/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return this.handleResponse(response);
  };

  /**
   * Inscription nouvel utilisateur
   */
  public async register(username: string, password: string, email: string): Promise<any> {
    // Envoie une requête d'inscription
    const response = await fetch(`${environment.baseURL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email }),
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  /**
   * Récupère le panier d'un utilisateur
   * @returns {Promise<CartItem[]>} - Liste des produits du panier
   */
  public async getCart(): Promise<CartItem[]> {
    console.log("getCart service OK");
    const response = await fetch(`${environment.baseURL}/cart/me`, {
      credentials: 'include'
    });
    const data = await this.handleResponse(response);
    console.log("getCart response", data);
    return data;
  }

  /**
   * Ajoute un produit au panier
   * @param productId - Identifiant du produit
   * @param quantity - Quantité à ajouter
   * @returns {Promise<any>}
   */
  public async addProductToCart(productId: number, quantity: number = 1): Promise<any> {
    const response = await fetch(`${environment.baseURL}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ productId, quantity })
    });

    return this.handleResponse(response);
  }

  /**
   * Retire un produit du panier
   */
  public async removeProductFromCart(productId: number): Promise<any> {
    const response = await fetch(`${environment.baseURL}/cart/remove`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ productId })
    });

    return this.handleResponse(response);
  }

  /**
   * Vide le panier
   */
  public async clearCart(): Promise<any> {
    const response = await fetch(`${environment.baseURL}/cart/clear`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  /**
   * Récupère le panier local stocké dans le cookie "cart".
   * 
   * @returns {any[]} Tableau des produits du panier local.
   */
  public getCookieCart(): any[] {
    const match = document.cookie.match(/(?:^|;\s*)cart=([^;]*)/);
    if (!match) return [];

    try {
      return JSON.parse(decodeURIComponent(match[1]));
    } catch {
      // En cas de corruption ou format invalide, on repart de zéro
      return [];
    }
  }

  /**
   * Met à jour le panier local dans le cookie "cart".
   * 
   * @param cart Tableau des produits à stocker dans le cookie.
   */
  public setCookieCart(cart: any[]): void {
    // Sérialise et stocke à nouveau le panier dans le cookie (durée : 7 jours)
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    document.cookie = `cart=${encodeURIComponent(JSON.stringify(cart))}; path=/; expires=${expires.toUTCString()};  SameSite=Lax`;
  }

  /**
   * Calcule le prix total d'un panier.
   * 
   * @param cart Tableau des produits du panier
   * @returns {number} Le montant total de tous les produits du panier.
   */
  public getTotalPrice(cart: CartItem[]): number {
    return cart.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);
  }

  /**
   * Calcule le montant hors taxes (HT) à partir du total TTC.
   * @param totalTTC - Montant toutes taxes comprises
   * @returns {number} Montant hors taxes
   */
  public getTotalHT(totalTTC: number): number {
    return +(totalTTC / 1.2).toFixed(2);
  }

  /**
   * Calcule le montant de la TVA (20%) à partir du total TTC.
   * @param totalTTC - Montant toutes taxes comprises
   * @returns {number} Montant de la TVA
   */
  public getTVA(totalTTC: number): number {
    return +(totalTTC - this.getTotalHT(totalTTC)).toFixed(2);
  }

  /**
   * Observable du panier partagé pour synchroniser le panier entre les composants.
   * Utiliser `cart$` pour s'abonner aux changements du panier.
   */
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  /**
   * Observable du panier partagé.
   */
  cart$ = this.cartSubject.asObservable();

  /**
   * Met à jour le panier partagé et notifie tous les abonnés.
   * À appeler après chaque modification du panier (ajout, suppression, vidage).
   * @param cart Tableau des produits du panier à partager
   */
  public updateCart(cart: CartItem[]) {
    this.cartSubject.next(cart);
  }

  /**
   * Crée une session Stripe Checkout côté backend et retourne l'id de session.
   * @param cart Le panier à payer
   * @param user L'utilisateur qui paie
   * @returns {Promise<any>} L'id de session Stripe
   */
  public async createStripeSession(cart: CartItem[], user: User): Promise<any> {
    const response = await fetch(`${environment.baseURL}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ cart, user })
    });

    return this.handleResponse(response); // Utilise la gestion d'erreur centralisée
  }

  /**
   * Récupère la dernière commande passée par un utilisateur.
   * @param userId - Identifiant de l'utilisateur
   * @returns {Promise<any>} La dernière commande trouvée ou null
   */
  public async getLastOrder(userId: number): Promise<any> {
    const response = await fetch(`${environment.baseURL}/orders/last/${userId}`, {
      method: 'GET',
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  /**
   * Récupère toutes les commandes passées par un utilisateur.
   * @param userId - Identifiant de l'utilisateur
   * @returns {Promise<Order[]>} Liste des commandes
   */
  public async getAllOrders(userId: number): Promise<Order[]> {
    const response = await fetch(`${environment.baseURL}/orders/all/${userId}`, {
      method: 'GET',
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  /**
   * Récupère le détail d'une commande par son identifiant.
   * @param orderId - Identifiant de la commande
   * @returns {Promise<Order>} La commande trouvée
   */
  public async getOrderById(orderId: number): Promise<Order> {
    const response = await fetch(`${environment.baseURL}/orders/${orderId}`, {
      method: 'GET',
      credentials: 'include'
    });
    return this.handleResponse(response);
  }

  /**
   * Envoie un message de contact au serveur.
   * @param data - Objet contenant le nom, email, sujet et message
   * @returns {Promise<any>} Réponse du serveur (succès ou erreur)
   */
  public async sendContactMessage(data: ContactMessage): Promise<any> {
    const response = await fetch(`${environment.baseURL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }
}