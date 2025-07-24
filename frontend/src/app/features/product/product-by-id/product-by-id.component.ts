import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Product } from '../../../core/interfaces/models';
import { ActivatedRoute } from '@angular/router'; // Pour accéder aux paramètres de l'URL

@Component({
  selector: 'app-product-by-id',
  standalone: true,
  imports: [],
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

// subscribe sert à écouter les changements des paramètres de la route (ici, l’id du produit dans l’URL).
// this.route.paramMap est un Observable qui émet un nouvel objet paramMap à chaque fois que les paramètres de l’URL changent (par exemple, si tu navigues de /product/1 à /product/2 sans recharger la page).
// subscribe(...) permet d’exécuter la fonction à chaque changement :
// Tu récupères l’id dans l’URL.
// Tu appelles l’API pour charger le bon produit.
// Tu mets à jour la propriété product du composant.