import { Injectable } from '@angular/core';
import { EditUser, Product, User } from '../interfaces/models';
import { environment } from '../../../environments/environment.development';

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
    if (!response.ok) throw data;
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
    const response = await fetch(`${environment.baseURL}/products/hommes`)
    return this.handleResponse(response);
  };

  /**
   * Récupère les produits femmes
   */
  public async getWomanProducts(): Promise<Product[]> {
    // Envoie une requête pour récupérer les produits femmes
    const response = await fetch(`${environment.baseURL}/products/femmes`)
    return this.handleResponse(response);
  };

  /**
   * Récupère les nouveautés produits
   */
  public async getProductsNews(): Promise<Product[]> {
    // Envoie une requête pour récupérer les nouveautés
    const response = await fetch(`${environment.baseURL}/products/news`);
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
}