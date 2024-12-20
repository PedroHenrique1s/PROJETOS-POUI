import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produtos } from './produtos.model';
import { ProdutosServiceModel } from './produtosService.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {

  private url = "/api/treinamento/v1/servicoProdutos"

  httpOptions = {
    headers: new HttpHeaders({ 'content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) {}

  getAll(page:number = 1, filtro:string = ''): Observable<ProdutosServiceModel>{
    const filter = `?pageSize=20&page=${page}&${filtro}`
    return this.httpClient.get<ProdutosServiceModel>(`${this.url}/${filter}`,)
  }

  getById(id:string): Observable<Produtos>{
    return this.httpClient.get<Produtos>(`${this.url}/${id}`)
  }

  put(id: string, formulario: Produtos): Observable<Produtos>{
    return this.httpClient.put<Produtos>(`${this.url}/${id}`, JSON.stringify(formulario), this.httpOptions)
  }

  post(formulario: Produtos): Observable<Produtos>{
    return this.httpClient.post<Produtos>(`${this.url}`, JSON.stringify(formulario), this.httpOptions)
  }

  delete(id: string): Observable<Produtos> {
    return this.httpClient.delete<Produtos>(`${this.url}/${id}`);
  }


}
