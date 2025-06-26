import { Component } from '@angular/core';
import { Product } from '../interfaces/models';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-product-list-woman',
  imports: [],
  templateUrl: './product-list-woman.component.html',
  styleUrl: './product-list-woman.component.css'
})
export class ProductListWomanComponent {
      // injection de la dépendance ApiService par Angular
      constructor(private api : ApiService){}
    
      products : Product[] = [];
    
      // ngOnInit est appelée par Angular une fois à l'initialisation du composant
      ngOnInit(): void {
        this.api.getWomanProducts().then(products=>{
          // Je fetch tout mes produits et les places dans l'état produits.
          this.products = products
          console.log(this.products);
        });
      }

      test(){
        console.log("product by id")
      }
}
