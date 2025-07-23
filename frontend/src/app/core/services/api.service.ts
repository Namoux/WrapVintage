import { Injectable } from '@angular/core';
import { EditUser, Product, User } from '../interfaces/models';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor() { }

  public async getProducts(limit: number = 100): Promise<Product[]> {
    // Ma fonction asyncrone renvoie une promesse de Product[]
    return fetch(`${environment.baseURL}/products/all` + limit)
      .then(res => res.json());
  };

  public async getManProducts(): Promise<Product[]> {
    // Ma fonction asyncrone renvoie une promesse de Product[]
    return fetch(`${environment.baseURL}/products/hommes`)
      .then(res => res.json());
  };

  public async getWomanProducts(): Promise<Product[]> {
    // Ma fonction asyncrone renvoie une promesse de Product[]
    return fetch(`${environment.baseURL}/products/femmes`)
      .then(res => res.json());
  };

  public async getProductsNews(): Promise<Product[]> {
    // Ma fonction asyncrone renvoie une promesse de Product[]
    return fetch(`${environment.baseURL}/products/news`)
      .then(res => res.json());
  };

  public async getProductbyId(id: number): Promise<Product> {
    // Ma fonction asyncrone renvoie une promesse de Product
    return fetch(`${environment.baseURL}/products/` + id)
      .then(res => res.json())
      .then(data => data[0]); // renvoie directement l'objet
  };

  public async getSearchProduct(query: string): Promise<Product[]> {
    return fetch(`${environment.baseURL}/products/search/` + query)
      .then(res => res.json());
  };

  public async login(username: string, password: string): Promise<User> {
    const response = await fetch(`${environment.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "username": username, "password": password }),
      credentials: 'include' // Permet d'envoyer et de recevoir les cookies
    });

    if (!response.ok) {
      // On tente de lire le message d'erreur du backend
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erreur lors de la connexion');
    }

    // On récupère le user + token
    return response.json();
  };

  public async getMe(): Promise<User> {
    const response = await fetch(`${environment.baseURL}/auth/me`, {
      method: 'GET',
      credentials: 'include' // envoyer le cookie
    });

    if (!response.ok) {
      throw new Error("Non authentifié");
    }

    return response.json();
  };

  public async logout(): Promise<void> {
    const response = await fetch(`${environment.baseURL}/auth/logout`, {
      method: 'POST',
      credentials: 'include' // Important pour supprimer le cookie
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la déconnexion");
    }
  };

  public async updateUser(id: number, user: EditUser): Promise<any> {
    const response = await fetch(`${environment.baseURL}/users/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      // On lève une erreur avec le message du backend
      throw data;
    };

    return data;

  };

  public async deleteUser(id: number): Promise<any> {
    const response = await fetch(`${environment.baseURL}/users/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  };

}
