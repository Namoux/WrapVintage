import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductListComponent } from "./product-list/product-list.component";
import { ProductListManComponent } from './product-list-man/product-list-man.component';
import { ProductListWomanComponent } from './product-list-woman/product-list-woman.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductListComponent, ProductListManComponent, ProductListWomanComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
