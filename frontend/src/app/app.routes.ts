import { Routes } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
// import { ProductListNewComponent } from './features/product/product-list-new/product-list-new.component';
// import { ProductListManComponent } from './features/product/product-list-man/product-list-man.component';
// import { ProductListWomanComponent } from './features/product/product-list-woman/product-list-woman.component';
import { ProductListComponent } from './features/product/product-list/product-list.component';
import { DeliveryComponent } from './features/info/delivery/delivery.component';
import { PaymentConditionComponent } from './features/info/payment-condition/payment-condition.component';
import { CGVComponent } from './features/info/cgv/cgv.component';
import { ProductByIdComponent } from './features/product/product-by-id/product-by-id.component';
import { SearchbarComponent } from './layout/searchbar/searchbar.component';
import { CompteComponent } from './layout/compte/compte.component';
import { CartComponent } from './features/cart/cart.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // page d'accueil
  { path: 'nouveautes', component: ProductListComponent, data: { category: 'new' } }, // page nouveautes
  { path: 'bracelet-homme', component: ProductListComponent, data: { category: 'man' } },// page bracelet-homme
  { path: 'bracelet-femme', component: ProductListComponent, data: { category: 'woman'} }, // page bracelet-femme
  { path: 'livraison', component: DeliveryComponent }, // page livraison
  { path: 'payment-condition', component: PaymentConditionComponent }, // page paiement condition
  { path: 'cgv', component: CGVComponent }, // page CGV
  { path: 'product/:id', component: ProductByIdComponent }, // page produit detail
  { path: 'searchbar', component: SearchbarComponent }, // barre de recherche
  { path: 'mon-compte', component: CompteComponent }, // Compte
  { path: 'panier', component: CartComponent }, // Panier
];
