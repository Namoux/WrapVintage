import { Component } from '@angular/core';
import { Product } from '../interfaces/models';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-product-list-new',
  imports: [],
  templateUrl: './product-list-new.component.html',
  styleUrl: './product-list-new.component.css'
})
export class ProductListNewComponent {
    // injection de la dépendance ApiService par Angular
    constructor(private api : ApiService){}
  
    products : Product[] = [];
  
    // ngOnInit est appelée par Angular une fois à l'initialisation du composant
    ngOnInit(): void {
      this.api.getProductsNews().then(products=>{
        // Je fetch tout mes produits et les places dans l'état produits.
        this.products = products
      });
    }
}
