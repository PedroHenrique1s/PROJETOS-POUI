import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Supplier } from '../model/supplierModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FornecedorFormService {


  ApiRest = `${environment.urlBase}/api/crm/v1/customerVendor`;
  // ApiRest = '/api/crm/v1/customerVendor';

  constructor(private http: HttpClient) { }

  //Método para criar um novo fornecedor
  postNewSupplier(body: string){
    return this.http.post(this.ApiRest, body);
  }

  //Método para recuperar um Fornecedor
  //type: 1 = cliente, 2= fornecedor, 3 = ambos
  getSupplier(SupplierId: string, type: string = '2'){
    return this.http.get<Supplier>(this.ApiRest + `/${type}/${SupplierId}`);
  }

  //Método para Alterar um Fornecedor
  //type: 1 = cliente, 2= fornecedor, 3 = ambos
  
  putSupplier(SupplierId: string, body: string, type: string = '2'){
    return this.http.put(this.ApiRest+ `/${type}/${SupplierId}`, body);
  }



}
