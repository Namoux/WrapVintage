import { Injectable } from '@angular/core';
import { Product } from './interfaces/models';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor() { }

  public async getProducts(limit : number = 100) : Promise <Product[]> {
    // Ma fonction asyncrone renvoie une promesse de Product[]
    return fetch(`${environment.baseURL}/all-products/`+limit)
    .then(res=>res.json());
  }

  public async getManProducts() : Promise <Product[]> {
    // Ma fonction asyncrone renvoie une promesse de Product[]
    return fetch(`${environment.baseURL}/product-man`)
    .then(res=>res.json());
  }

  public async getWomanProducts() : Promise <Product[]> {
    // Ma fonction asyncrone renvoie une promesse de Product[]
    return fetch(`${environment.baseURL}/product-woman`)
    .then(res=>res.json());
  }

  public async getProductsNews() : Promise <Product[]> {
    // Ma fonction asyncrone renvoie une promesse de Product[]
    return fetch(`${environment.baseURL}/all-newproducts`)
    .then(res=>res.json());
  }

  public async getProductbyId(id : number) : Promise <Product> {
    // Ma fonction asyncrone renvoie une promesse de Product
    return fetch(`${environment.baseURL}/product/`+id)
    .then(res=>res.json())
    .then(data => data[0]); // ✅ renvoie directement l'objet
  }

}
