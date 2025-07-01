import { Component, OnInit } from '@angular/core';
import { Product } from '../interfaces/models';
import { ApiService } from '../api.service'; // Service pour appeler l’API
import { ActivatedRoute } from '@angular/router'; // Pour accéder aux paramètres de l'URL
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-by-id',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-by-id.component.html',
  styleUrls: ['./product-by-id.component.css']
})
export class ProductByIdComponent implements OnInit {

  product!: Product; // Propriété pour stocker le produit à afficher

  constructor(
    private route: ActivatedRoute,   // Pour récupérer les paramètres de l'URL
    private apiService: ApiService   // Pour appeler l’API et récupérer le produit
  ) {}

  ngOnInit(): void {
    // Écoute les changements de l'ID dans l'URL (utile si on est déjà sur /product/:id)
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id')); // Récupère l'ID depuis l'URL
      console.log("Produit ID depuis l'URL :", id);

      // Appelle l'API pour récupérer les infos du produit correspondant
      this.apiService.getProductbyId(id).then(product => {
        this.product = product; // Met à jour la propriété avec les données reçues
        console.log("Produit récupéré :", this.product);
      });
    });
  }
}
