import { Injectable } from '@angular/core';
import { Product } from './interfaces/Variables';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor() { }

  public async getProducts(limit : number = 100) : Promise <Product[]> {
    // Ma fonction asyncrone renvoie une promesse de Product[]
    return fetch("http://0.0.0.0:4004/all-products/"+limit)
    .then(res=>res.json());
  }
}
