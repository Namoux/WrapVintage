import { Injectable } from '@angular/core';
import { Product } from './interfaces/models';
import { baseURL } from './interfaces/constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor() { }

  public async getProducts(limit : number = 100) : Promise <Product[]> {
    // Ma fonction asyncrone renvoie une promesse de Product[]
    return fetch(`${baseURL}/all-products/`+limit)
    .then(res=>res.json());
  }

  public async getManProducts() : Promise <Product[]> {
    // Ma fonction asyncrone renvoie une promesse de Product[]
    return fetch(`${baseURL}/product-man/`)
    .then(res=>res.json());
  }

    public async getWomanProducts() : Promise <Product[]> {
    // Ma fonction asyncrone renvoie une promesse de Product[]
    return fetch(`${baseURL}/product-woman/`)
    .then(res=>res.json());
  }
}
