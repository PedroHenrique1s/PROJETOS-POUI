import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TesteComponent } from './components/teste/teste.component';
import { Teste2Component } from './components/teste2/teste2.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'components/teste',
    pathMatch: 'full'
  },
  {
    path: 'grafico',
    component: TesteComponent
  },  
  {
    path: 'tabela',
    component: Teste2Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
