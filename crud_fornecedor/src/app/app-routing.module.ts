import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FornecedorListComponent } from './fornecedor-list/fornecedor-list.component';
import { FornecedorFormComponent } from './fornecedor-form/fornecedor-form.component';

const routes: Routes = [
  { path: '', component: FornecedorListComponent}, //Raiz
  { path: 'fornecedor', component: FornecedorListComponent}, //lista de fornecedor
  { path: 'fornecedorform', component: FornecedorFormComponent}, //form do fornecedor - Incluir
  { path: 'fornecedorform/:id/:type',component: FornecedorFormComponent}, //form do fornecedor - Editar
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
