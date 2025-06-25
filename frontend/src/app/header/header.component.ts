import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuBurgerComponent } from '../menu-burger/menu-burger.component';

@Component({
  selector: 'app-header',
  imports: [RouterModule, MenuBurgerComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  isMenuOpen = false; // État du menu

  /** Bascule l'état du menu */
  openMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    console.log("Menu clicked - Etat:", this.isMenuOpen);
  }

  // Au scroll, fermeture du menu
  constructor() {
    window.addEventListener('scroll', () => {
      if (this.isMenuOpen) {
        this.isMenuOpen = false;
      }
    });
  }

}
