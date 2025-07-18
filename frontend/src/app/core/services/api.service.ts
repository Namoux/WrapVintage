import { Injectable } from '@angular/core';
import { Product } from '../interfaces/models';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor() { }

  public async getProducts(limit : number = 100) : Promise <Product[]> {
    // Ma fonction asyncrone renvoie une promesse de Product[]
    return fetch(`${environment.baseURL}/products/all`+limit)
    .then(res=>res.json());
  }

  public async getManProducts() : Promise <Product[]> {
    // Ma fonction asyncrone renvoie une promesse de Product[]
    return fetch(`${environment.baseURL}/products/hommes`)
    .then(res=>res.json());
  }

  public async getWomanProducts() : Promise <Product[]> {
    // Ma fonction asyncrone renvoie une promesse de Product[]
    return fetch(`${environment.baseURL}/products/femmes`)
    .then(res=>res.json());
  }

  public async getProductsNews() : Promise <Product[]> {
    // Ma fonction asyncrone renvoie une promesse de Product[]
    return fetch(`${environment.baseURL}/products/news`)
    .then(res=>res.json());
  }

  public async getProductbyId(id : number) : Promise <Product> {
    // Ma fonction asyncrone renvoie une promesse de Product
    return fetch(`${environment.baseURL}/products/`+id)
    .then(res=>res.json())
    .then(data => data[0]); // renvoie directement l'objet
  }

  public async getSearchProduct(query : string) : Promise <Product[]> {
    return fetch(`${environment.baseURL}/products/search/`+query)
    .then(res=>res.json());
  }

}
