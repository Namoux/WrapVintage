import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Product } from '../../../core/interfaces/models';
import { ActivatedRoute } from '@angular/router'; // Pour accéder aux paramètres de l'URL

@Component({
  selector: 'app-product-by-id',
  standalone: true,
  imports: [],
  templateUrl: './product-by-id.component.html',
  styleUrls: ['./product-by-id.component.css']
})
export class ProductByIdComponent implements OnInit {

  product!: Product; // Propriété pour stocker le produit à afficher
  successMessage?: string;
  showSuccess = false;
  errorMessage?: string;
  showError = false;

  constructor(
    private route: ActivatedRoute,   // Pour récupérer les paramètres de l'URL
    private apiService: ApiService   // Pour appeler l’API et récupérer le produit
  ) { }

  // subscribe sert à écouter les changements des paramètres de la route (ici, l’id du produit dans l’URL).
  // this.route.paramMap est un Observable qui émet un nouvel objet paramMap à chaque fois que les paramètres de l’URL changent (par exemple, si tu navigues de /product/1 à /product/2 sans recharger la page).
  // subscribe(...) permet d’exécuter la fonction à chaque changement :
  // Tu récupères l’id dans l’URL.
  // Tu appelles l’API pour charger le bon produit.
  // Tu mets à jour la propriété product du composant.
  ngOnInit(): void {
    // Écoute les changements de l'ID dans l'URL (utile si on est déjà sur /product/:id)
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id')); // Récupère l'ID depuis l'URL
      console.log("Produit ID depuis l'URL :", id);

      // Appelle l'API pour récupérer les infos du produit correspondant
      this.apiService.getProductbyId(id).then(product => {
        this.product = product; // Met à jour la propriété avec les données reçues
        console.log("Produit récupéré :", this.product);
      });
    });
  }

  /**
 * Ajoute le produit affiché au panier.
 * 
 * - Si l'utilisateur est connecté, ajoute le produit au panier côté serveur via l'API.
 * - Si l'utilisateur n'est pas connecté (erreur 401), ajoute le produit au panier local (stocké en cookie).
 * 
 * Affiche un message de succès ou d'erreur selon le résultat.
 * Déclenche l'événement 'cartUpdated' pour mettre à jour le header.
 */
  async addToCart() {
    this.successMessage = undefined;
    this.errorMessage = undefined;

    try {
      const user = await this.apiService.getMe();

      if (user && this.product) {
        await this.apiService.addProductToCart(this.product.id, 1);

        this.successMessage = 'Produit ajouté au panier !';
        this.showSuccess = true;
        setTimeout(() => this.showSuccess = false, 600);
        setTimeout(() => this.successMessage = undefined, 1000);
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error: any) {
      // Utilisateur non connecté (401) → panier cookie
      if (error.status === 401 && this.product) {
        console.log("Non authentifié, produit ajouté dans le cookie")
        this.addToCookieCart();
      } else {
        console.log("Erreur technique lors de l'ajout au panier")
        this.errorMessage = "Erreur technique lors de l'ajout au panier";
        this.showError = true;
        setTimeout(() => this.showError = false, 600);
        setTimeout(() => this.errorMessage = undefined, 1000);
        console.error(error);
      }
    }
  }

  /**
 * Ajoute le produit affiché au panier local (stocké en cookie).
 * 
 * - Si le produit existe déjà dans le panier, incrémente la quantité.
 * - Sinon, ajoute le produit avec une quantité de 1.
 * 
 * Met à jour le cookie, affiche un message de succès et déclenche l'événement 'cartUpdated'.
 */
  private addToCookieCart(): void {
    if (!this.product) return;

    // Récupère le panier depuis le cookie (sous forme JSON)
    const cart = this.apiService.getCookieCart();

    // Cherche si le produit est déjà présent dans le panier
    const existing = cart.find((item: any) => item.id === this.product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...this.product, quantity: 1 });
    }

    // Sérialise et stocke à nouveau le panier dans le cookie (durée : 7 jours)
    this.apiService.setCookieCart(cart);

    // Message de confirmation
    this.successMessage = 'Produit ajouté au panier !';
    this.showSuccess = true;
    setTimeout(() => this.showSuccess = false, 600);
    setTimeout(() => this.successMessage = undefined, 1000);

    // Notifie les autres composants (ex: header) que le panier a été mis à jour
    window.dispatchEvent(new Event('cartUpdated'));
  }
}