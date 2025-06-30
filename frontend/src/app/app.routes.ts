import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductListNewComponent } from './product-list-new/product-list-new.component';
import { ProductListManComponent } from './product-list-man/product-list-man.component';
import { ProductListWomanComponent } from './product-list-woman/product-list-woman.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { PaymentConditionComponent } from './payment-condition/payment-condition.component';
import { CGVComponent } from './cgv/cgv.component';
import { ProductByIdComponent } from './product-by-id/product-by-id.component';
import { SearchbarComponent } from './searchbar/searchbar.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // page d'accueil
  { path: 'nouveautes', component: ProductListNewComponent }, // page nouveautes
  { path: 'bracelet-homme', component: ProductListManComponent },// page bracelet-homme
  { path: 'bracelet-femme', component: ProductListWomanComponent }, // page bracelet-femme
  { path: 'livraison', component: DeliveryComponent }, // page livraison
  { path: 'payment-condition', component: PaymentConditionComponent }, // page paiement condition
  { path: 'cgv', component: CGVComponent }, // page CGV
  { path: 'product/:id', component: ProductByIdComponent }, // page produit detail
  { path: 'searchbar', component: SearchbarComponent } // barre de recherche
];
