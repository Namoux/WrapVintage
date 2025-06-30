import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  // Injection du service Router dans le constructeur
  constructor(private router: Router) {
    // Abonnement aux événements du routeur
    this.router.events.subscribe((event) => {
      // Vérification que la page est a la fin
      if (event instanceof NavigationEnd) {
        // Défilement vers le haut de la page
        window.scrollTo(0, 0);
      }
    });
  }

}
