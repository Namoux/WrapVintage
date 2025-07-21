import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service'; // Service pour récupérer les produits via l'API
import { ActivatedRoute } from '@angular/router'; // Permet d'accéder aux données de la route
import { Product } from '../../../core/interfaces/models'; // Interface du modèle Product
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../../shared/product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true, // Composant autonome (pas besoin de module)
  imports: [RouterModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'] // Fichier(s) de style associé(s)
})

export class ProductListComponent implements OnInit {
  // injection de la dépendance ApiService et ActivatedRoute par Angular
  constructor(private api: ApiService, private route: ActivatedRoute) { }

  category: 'new' | 'man' | 'woman' | 'all' = 'all'; // Catégorie courante (par défaut : 'all')
  products: Product[] = []; // Liste des produits à afficher

  // ngOnInit est appelée par Angular une fois à l'initialisation du composant
  ngOnInit(): void {
    // On s'abonne aux données de la route pour récupérer la catégorie
    this.route.data.subscribe(data => {
      this.category = data['category'] || 'all'; // Récupère la catégorie depuis la route ou 'all' par défaut
      this.loadProducts(); // Charge les produits correspondants
    });
  };

  // La méthode subscribe sert à écouter les changements d’une source de données asynchrone appelée un Observable (dans Angular, souvent pour les routes, les requêtes HTTP, etc.).
  // this.route.data est un Observable qui émet les données associées à la route (par exemple, la catégorie).
  // subscribe(...) permet d’exécuter une fonction à chaque fois que ces données changent (par exemple, quand ca navigue vers une autre catégorie).
  // À chaque changement, ca mets à jour la catégorie et ca recharges les produits.

  // Charge les produits selon la catégorie courante
  loadProducts(): void {
    switch (this.category) {
      case 'new':
        // Je fetch tout mes produits et les places dans l'état produits.
        this.api.getProductsNews().then(product => this.products = product);
        break;
      case 'man':
        this.api.getManProducts().then(product => this.products = product);
        break;
      case 'woman':
        this.api.getWomanProducts().then(product => this.products = product);
        break;
      default:
        this.api.getProducts().then(product => this.products = product);
    }
  }
}
