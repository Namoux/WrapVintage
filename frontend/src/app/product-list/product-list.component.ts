import { Component, OnInit } from '@angular/core';
import { Product } from '../interfaces/models';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-product-list',
  imports: [],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})

export class ProductListComponent {
  // injection de la dépendance ApiService par Angular
  constructor(private api : ApiService){}

  products : Product[] = [];

  // ngOnInit est appelée par Angular une fois à l'initialisation du composant
  ngOnInit(): void {
    this.api.getProducts().then(products=>{
      // Je fetch tout mes produits et les places dans l'état produits.
      this.products = products
      console.log(this.products);
    });
  }

}
