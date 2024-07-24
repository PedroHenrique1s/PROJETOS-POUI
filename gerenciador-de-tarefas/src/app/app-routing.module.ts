import { NgModule } from "@angular/core";
import {Routes, RouterModule} from "@angular/router"
import { TarefaRoutes } from "./tarefas";

export const routes: Routes = [
  
    {
        path:'',
        redirectTo: '/tarefas/listar',
        pathMatch: 'full' //passa a patch completa se não pode se perder
    },
    ...TarefaRoutes // ... vai concatenar o array de rotas
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})


export class AppRoutingModule {}