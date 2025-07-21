import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '../../core/interfaces/models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product; // Permet de recevoir un objet Product depuis le composant parent (liaison de données descendante)
}

// @Input() indique que la propriété product peut être renseignée depuis le composant parent via un binding [product]="...".
// Le !: signifie à TypeScript que la propriété sera bien initialisée par Angular.
// Le type Product assure que seules des données conformes à l’interface Product peuvent être passées.