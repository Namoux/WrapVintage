import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProductListComponent } from './features/product/product-list/product-list.component';
import { DeliveryComponent } from './features/info/delivery/delivery.component';
import { PaymentConditionComponent } from './features/info/payment-condition/payment-condition.component';
import { CGVComponent } from './features/info/cgv/cgv.component';
import { ProductByIdComponent } from './features/product/product-by-id/product-by-id.component';
import { SearchbarComponent } from './layout/searchbar/searchbar.component';
import { CompteComponent } from './layout/compte/compte.component';
import { CartComponent } from './features/cart/cart.component';
import { OrderComponent } from './features/order/order.component';
import { OrderConfirmationComponent } from './features/order-confirmation/order-confirmation.component';

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
  { path: 'commande', component: OrderComponent }, // Commande 
  { path: 'success', component: OrderConfirmationComponent }, // Confirmation de paiement réussi
  { path: 'cancel', component: OrderConfirmationComponent } // Annulation de paiement
];
