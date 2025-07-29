import { Component, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuBurgerComponent } from '../menu-burger/menu-burger.component';
import { SearchbarComponent } from "../searchbar/searchbar.component";
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
import { ApiService } from '../../core/services/api.service';
import { CartComponent } from '../../features/cart/cart.component';

@Component({
  selector: 'app-header',
  imports: [RouterModule, MenuBurgerComponent, SearchbarComponent, LoginModalComponent, RegisterModalComponent, CartComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  // Récupère une référence au composant Cart pour pouvoir appeler ses méthodes (loadCart) depuis le header
  @ViewChild(CartComponent) cartComponent?: CartComponent;

  isMenuOpen = false; // État du menu
  isSearchOpen = false;
  isCartOpen = false;
  isLoginOpen = false;
  isRegisterOpen = false;
  userName: string | null = null;
  cartQuantity = 0;

  /** Bascule l'état du menu */
  openMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    console.log("Menu clicked - Etat:", this.isMenuOpen);
  }

  /**
   * Ouvre ou ferme la barre de recherche.
   */
  openSearchbar() {
    this.isSearchOpen = !this.isSearchOpen;
    console.log("Search clicked - Etat:", this.isSearchOpen);
  }

  /**
   * Ouvre ou ferme le panier.
   */
  openCart() {
    this.isCartOpen = !this.isCartOpen;
    console.log("Cart clicked - Etat:", this.isCartOpen);
    if (this.isCartOpen) {
      // Recharge le panier à chaque ouverture
      // Le setTimeout permet de s'assurer que le composant Cart est bien affiché avant d'appeler loadCart().
      setTimeout(() => this.cartComponent?.loadCart(), 0);
    }
  }

  /**
   * Ouvre la modale de connexion si l'utilisateur n'est pas connecté,
   * sinon redirige vers la page "mon compte".
   */
  openLogin() {
    if (this.userName) {
      this.router.navigate(['/mon-compte']);
    } else {
      this.isLoginOpen = true;
      this.isRegisterOpen = false;
      console.log("Login modal ouvert");
    }
  }

  /**
   * Ferme les modales de connexion et d'inscription.
   */
  closeModals() {
    this.isLoginOpen = false;
    this.isRegisterOpen = false;
  }

  /**
   * Ouvre la modale d'inscription et ferme la modale de connexion.
   */
  openRegister() {
    this.isRegisterOpen = true;
    this.isLoginOpen = false;
    console.log("Register modal ouvert");
  }

  /**
   * Méthode du cycle de vie Angular appelée à l'initialisation du composant.
   * Charge le nom d'utilisateur pour l'afficher dans le header.
   * Charge la quantité de produit dans le panier pour l'afficher dans le header.
   */
  ngOnInit() {
    this.loadUserName();
    this.loadCartQuantity();
  }

  /**
   * Charge le nom d'utilisateur depuis l'API.
   * Si l'utilisateur est connecté, met à jour userName avec son nom.
   * Si non connecté ou erreur, met userName à null pour masquer l'affichage.
   */
  async loadUserName() {
    try {
      const user = await this.api.getMe();
      this.userName = user.username;
    } catch {
      this.userName = null;
    }
  }

/**
 * Met à jour la quantité totale de produits dans le panier à afficher dans le header.
 * 
 * - Si l'utilisateur est connecté, récupère le panier côté serveur via l'API et additionne les quantités.
 * - Si l'utilisateur n'est pas connecté ou en cas d'erreur, récupère le panier local (stocké en cookie ou localStorage) et additionne les quantités.
 * 
 * Cette méthode est appelée à l'initialisation du header et à chaque événement 'loadCartQuantity'.
 * 
 * @returns Promise<void> Met à jour la propriété cartQuantity du composant.
 */
async loadCartQuantity(): Promise<void> {
  try {
    // On tente de récupérer l'utilisateur connecté
    const user = await this.api.getMe();
    if (user) {
      // Utilisateur connecté : panier serveur
      const cart = await this.api.getCart();
      this.cartQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    } else {
      // Visiteur : panier dans cookie
      const localCart = this.api.getCookieCart();
      this.cartQuantity = localCart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
    }
  } catch {
    // En cas d'erreur (ex: non authentifié), fallback panier cookie
    const localCart = this.api.getCookieCart();
    this.cartQuantity = localCart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
  }
}

  // Au scroll, fermeture des fenetres appelés
  constructor(private router: Router, private api: ApiService) {
    window.addEventListener('scroll', () => {
      this.isMenuOpen = false;
      this.isSearchOpen = false;
      this.isRegisterOpen = false;
      this.isLoginOpen = false;
    });

    // Écoute l'événement de rafraîchissement du username
    // Ajoute un écouteur d'événement global sur la fenêtre pour le type 'loadUserName'.
    // Lorsque cet événement est déclenché (ex : après déconnexion ou suppression de compte),
    // la méthode loadUserName() est appelée pour mettre à jour l'affichage du nom d'utilisateur dans le header.
    window.addEventListener('loadUserName', () => {
      this.loadUserName(); // recharge le nom utilisateur
    });

    window.addEventListener('cartUpdated', () => {
      this.cartComponent?.loadCart(); // recharge les données du panier
    });

    window.addEventListener('loadCartQuantity', () => {
      this.loadCartQuantity(); // recharge les données du panier
    });
  }



}