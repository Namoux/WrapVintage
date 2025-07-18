import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../core/interfaces/models';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../../shared/product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterModule, CommonModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit {
  // injection de la dépendance ApiService par Angular
  constructor(private api : ApiService, private route: ActivatedRoute){}

  category: 'new' | 'man' | 'woman' | 'all' = 'all';
  products : Product[] = [];

  // ngOnInit est appelée par Angular une fois à l'initialisation du composant
  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.category = data['category'] || 'all';
      this.loadProducts();
    });
  };

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
