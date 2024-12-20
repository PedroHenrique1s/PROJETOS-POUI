import { Component } from '@angular/core';

import { PoMenuItem } from '@po-ui/ng-components';
import { ProAppConfigService } from '@totvs/protheus-lib-core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private proAppConfigService: ProAppConfigService) { }

  ngOnInit(): void {
  }

  readonly menus: Array<PoMenuItem> = [
    { label: 'grafico', link: "grafico", shortLabel: "grafico", icon: "po-icon-chart-columns" },
    { label: 'tabela', link: "tabela", shortLabel: "tabela", icon: "po-icon-clipboard" },
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
