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

  openSearchbar() {
    this.isSearchOpen = !this.isSearchOpen;
    console.log("Search clicked - Etat:", this.isSearchOpen);
  }

  openLogin() {
    if (this.userName) {
      this.router.navigate(['/mon-compte']);
    } else {
      this.isLoginOpen = true;
      this.isRegisterOpen = false;
      console.log("Login modal ouvert");
    }
  }

  closeModals() {
    this.isLoginOpen = false;
    this.isRegisterOpen = false;
  }

  openRegister() {
    this.isRegisterOpen = true;
    this.isLoginOpen = false;
    console.log("Register modal ouvert");
  }

  ngOnInit() {
    this.loadUserName();
  }

  async loadUserName() {
    try {
      const user = await this.api.getMe();
      this.userName = user.username;
    } catch {
      this.userName = null;
    }
  }

  refreshUserName() {
    this.loadUserName();
  }

  // Au scroll, fermeture du menu
  constructor(private router: Router, private api: ApiService) {
    window.addEventListener('scroll', () => {
      this.isMenuOpen = false;
      this.isSearchOpen = false;
      this.isRegisterOpen = false;
      this.isLoginOpen = false;
    });

    // Écoute l'événement de rafraîchissement du username
    window.addEventListener('refreshUserName', () => {
      this.refreshUserName();
    });
  }
}
