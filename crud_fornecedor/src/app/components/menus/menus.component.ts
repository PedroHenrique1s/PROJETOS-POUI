import { Component, OnInit } from '@angular/core';
import { PoMenuItem } from '@po-ui/ng-components';
import { ProAppConfigService } from '@totvs/protheus-lib-core';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css']
})
export class MenusComponent implements OnInit {

  constructor(private proAppConfigService: ProAppConfigService) { }

  ngOnInit(): void {
  }

  readonly menus: Array<PoMenuItem> = [
    { label: 'Cadastrar', link: "cadastrar", shortLabel: "Cadastrar", icon: "po-icon-clipboard" },
    { label: 'Análise de Dados', link: "dash", shortLabel: "Analise", icon: "po-icon-clipboard" },
    { label: 'Sair', link: '/', shortLabel: 'Sair', icon: 'po-icon-exit', action: this.closeApp.bind(this) }
  ];

  private closeApp(){
    if(this.proAppConfigService.insideProtheus()){
      this.proAppConfigService.callAppClose();
    }else{
      alert("o App não está sendo executado dentro do protheus");
    }
  }

}
