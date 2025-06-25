import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductListComponent } from "./product-list/product-list.component";
import { ProductListManComponent } from './product-list-man/product-list-man.component';
import { ProductListWomanComponent } from './product-list-woman/product-list-woman.component';
import { HeaderComponent } from './header/header.component';
import { ProductListNewComponent } from './product-list-new/product-list-new.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, HomeComponent, FooterComponent, ProductListComponent, ProductListManComponent, ProductListWomanComponent, ProductListNewComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
