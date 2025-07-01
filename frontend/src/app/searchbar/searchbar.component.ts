import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '../interfaces/models';
import { ApiService } from '../api.service';
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
  @Output() linkClicked = new EventEmitter<void>(); // ✅ Ajout de l'événement

  onProductClick() {
    this.linkClicked.emit(); // ✅ Notifie le parent pour fermer la searchbar
  }

  constructor(private api: ApiService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isSopen'] && !changes['isSopen'].currentValue) {
      // La searchbar vient d'être fermée => on reset
      this.query = '';
      this.products = [];
      this.errorMessage = '';
    }
  }

  query: string = '';
  products: Product[] = [];
  errorMessage: string = '';

  onSearchChange() {
    if (!this.query.trim()) {
      this.products = [];       // Vide la liste si la recherche est vide
      this.errorMessage = '';   // Pas d'erreur à afficher ici
      return;
    }

    this.api.getSearchProduct(this.query)
      .then(data => {
        if (Array.isArray(data)) {
          this.products = data.filter(p => p && p.id != null);
          this.errorMessage = '';
        } else {
          this.products = [];
          this.errorMessage = 'Produit introuvable.';
        }
      })
      .catch(err => {
        this.products = [];
        this.errorMessage = 'Produit introuvable.';
        console.error(err);
      });
  }
}
