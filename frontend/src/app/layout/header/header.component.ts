import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuBurgerComponent } from '../menu-burger/menu-burger.component';
import { SearchbarComponent } from "../searchbar/searchbar.component";

@Component({
  selector: 'app-header',
  imports: [RouterModule, MenuBurgerComponent, SearchbarComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  isMenuOpen = false; // État du menu
  isSearchOpen = false; 

  /** Bascule l'état du menu */
  openMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    console.log("Menu clicked - Etat:", this.isMenuOpen);
  }

  openSearchbar(){
    this.isSearchOpen = !this.isSearchOpen;
    console.log("Search clicked - Etat:", this.isSearchOpen);
  }

  // Au scroll, fermeture du menu
  constructor() {
    window.addEventListener('scroll', () => {
      if (this.isMenuOpen) {
        this.isMenuOpen = false;
      }
      if (this.isSearchOpen){
        this.isSearchOpen = false;
      }
    });
  }

}
