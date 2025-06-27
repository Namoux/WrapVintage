import { Component, OnInit } from '@angular/core';
import { Product } from '../interfaces/models';
import { ApiService } from '../api.service'; // Service pour appeler l’API
import { ActivatedRoute } from '@angular/router'; // Pour accéder aux paramètres de l'URL
import { CommonModule } from '@angular/common'; // contient NgIf, NgFor...

@Component({
  selector: 'app-product-by-id',
  imports: [CommonModule],
  templateUrl: './product-by-id.component.html',
  styleUrls: ['./product-by-id.component.css']
})
export class ProductByIdComponent implements OnInit {
  product!: Product; // Propriété pour stocker le produit récupéré (le "!" signifie qu’il sera initialisé plus tard)

  constructor(
    private route: ActivatedRoute, // Permet d'accéder à l'ID dans l'URL (par ex. /product/5)
    private apiService: ApiService // Injecte le service pour appeler l’API
  ) {}

  // Méthode appelée automatiquement à l’initialisation du composant
  ngOnInit(): void {

    // On récupère l’ID du produit depuis l’URL (converti en nombre)
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.apiService.getProductbyId(id).then(product => {

      // Une fois le produit récupéré via l’API, on le stocke dans la variable "product"
      this.product = product;
      console.log(this.product);
    });
  }
}
