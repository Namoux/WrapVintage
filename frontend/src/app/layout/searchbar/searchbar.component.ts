import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Product } from '../../core/interfaces/models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // pour ngModel

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent implements OnChanges {

  @Input() isSopen = false; // Reçoit l'état depuis le parent via Input (HeaderComponent)
  @Output() linkClicked = new EventEmitter<void>(); //  Ajout de l'événement

  onClose() {
    this.linkClicked.emit(); //  Notifie le parent pour fermer la searchbar
  }

  constructor(private api: ApiService) { }


  /**
 * Méthode du cycle de vie Angular appelée à chaque changement d'Input.
 * Ici, si la searchbar vient d'être fermée (isSopen passe à false),
 * on réinitialise la requête, la liste des produits et le message d'erreur.
 * @param {SimpleChanges} changes - Objet contenant les changements des Inputs
 */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['isSopen'] && !changes['isSopen'].currentValue) {
      // La searchbar vient d'être fermée => on reset
      this.query = '';
      this.products = [];
      this.errorMessage = '';
    }
  }

  // Requête de recherche saisie par l'utilisateur
  query: string = '';
  // Liste des produits trouvés
  products: Product[] = [];
  // Message d'erreur à afficher si aucun produit n'est trouvé
  errorMessage: string = '';

  /**
 * Méthode appelée à chaque changement dans le champ de recherche.
 * Si la requête est vide, on vide la liste des produits et le message d'erreur.
 * Sinon, on appelle l'API pour rechercher les produits correspondant à la requête.
 * Met à jour la liste des produits et le message d'erreur selon le résultat.
 */
  onSearchChange() {
    if (!this.query.trim()) {
      this.products = [];       // Vide la liste si la recherche est vide
      this.errorMessage = '';   // Pas d'erreur à afficher ici
      return;
    }

    // Appelle l'API pour rechercher les produits
    this.api.getSearchProduct(this.query)
      .then(data => {
        // On vérifie que la réponse de l'API est bien un tableau (liste de produits)
        if (Array.isArray(data)) {
          // On filtre ce tableau pour ne garder que les produits valides (ceux qui existent et ont un id non nul)
          this.products = data.filter(p => p && p.id != null);
          console.log(this.products);
          // On efface le message d'erreur car des produits ont été trouvés
          this.errorMessage = '';
        } else {
          // Si la réponse n'est pas un tableau, affiche une erreur
          this.products = [];
          this.errorMessage = 'Produit introuvable.';
        }
      })
      .catch(err => {
        // En cas d'erreur API, vide la liste et affiche une erreur
        this.products = [];
        this.errorMessage = 'Produit introuvable.';
        console.error(err);
      });
  }
}
