import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuBurgerComponent } from '../menu-burger/menu-burger.component';
import { SearchbarComponent } from "../searchbar/searchbar.component";
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
import { ApiService } from '../../core/services/api.service';
import { User } from '../../core/interfaces/models';


@Component({
  selector: 'app-header',
  imports: [RouterModule, MenuBurgerComponent, SearchbarComponent, LoginModalComponent, RegisterModalComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  isMenuOpen = false; // État du menu
  isSearchOpen = false;
  isLoginOpen = false;
  isRegisterOpen = false;
  userName: string | null = null;

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
   */
  ngOnInit() {
    this.loadUserName();
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
   * Rafraîchit le nom d'utilisateur affiché dans le header.
   * Appelée lors de l'événement personnalisé 'refreshUserName' (ex : après déconnexion ou suppression de compte).
   */
  refreshUserName() {
    this.loadUserName();
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
    // Ajoute un écouteur d'événement global sur la fenêtre pour le type 'refreshUserName'.
    // Lorsque cet événement est déclenché (ex : après déconnexion ou suppression de compte),
    // la méthode refreshUserName() est appelée pour mettre à jour l'affichage du nom d'utilisateur dans le header.
    window.addEventListener('refreshUserName', () => {
      this.refreshUserName();
    });
  }
}
