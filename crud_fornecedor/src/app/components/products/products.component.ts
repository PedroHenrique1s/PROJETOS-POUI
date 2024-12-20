import { Component, OnInit, ViewChild } from '@angular/core';
import { PoDynamicFormComponent, PoDynamicFormField, PoModalAction, PoModalComponent, PoNotificationService, PoPageAction, PoTableAction, PoTableColumn, PoTableComponent } from '@po-ui/ng-components';
import { Produtos } from './shared/produtos.model';
import { PoPageDynamicSearchFilters } from '@po-ui/ng-templates';
import { QueryParamsType } from '@po-ui/ng-components/lib/components/po-table/po-table-base.component';
import { ProdutosService } from './shared/produtos.service';
import { ProAppConfigService } from '@totvs/protheus-lib-core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  public colunasDaTabela: Array<PoTableColumn>;
  public itensDaTabela: Produtos[] = [];
  public filtroBuscaAvancada: Array<PoPageDynamicSearchFilters>;
  public opcoesTela: Array<PoPageAction> = [
    {label: 'Incluir', action: this.incluiProduto.bind(this)}
  ];
  public produto: { [key: string]: QueryParamsType} = {};
  public carregandoTabela = false;

  public formularioProduto: Array<PoDynamicFormField>
  public confirmarModal: PoModalAction = {
    action: () => {
      this.salvarFormulario();
    },
    label: 'Confirmar',
  };

  public cancelarModal: PoModalAction = {
    action: () => {
      this.poModal.close();
    },
    label: 'Cancelar',
  };

  public acoesTabela: Array<PoTableAction> = [
    {
      action:  this.editarItem.bind(this),
      icon: 'po-icon-edit',
      label: 'Editar'
    },
    {
      action:  this.excluirProduto.bind(this),
      icon: 'po-icon-delete',
      label: 'Excluir'
    }
  ];

  private filtrosAplicados: string = '';
  private page: number = 1;
  private edicao = false;

  @ViewChild('tableProdutos') tabelaProdutos: PoTableComponent;
  @ViewChild(PoModalComponent) poModal: PoModalComponent;
  @ViewChild(PoDynamicFormComponent) dynamicForm: PoDynamicFormComponent;
  
  constructor(
    private produtosService: ProdutosService,
    private poNotificationService: PoNotificationService,
    private configService: ProAppConfigService
  ) {
    this.colunasDaTabela = this.retornaColuna();
    this.filtroBuscaAvancada = this.retornaBuscaAvancada();
    this.formularioProduto = [
      {
        divider: 'Cadastro de Produto',
        property: 'codigo',
        icon: 'po-icon-user',
        label: 'Código do Produto',
        placeholder:'Digite o código do produto',
        type: 'string',
        gridColumns: 6
      },
      {
        property: 'descricao',
        placeholder:'Digite a descrição do produto',
        label: 'Descrição do Produto',
        type: 'string',
        gridColumns: 6
      },
      {
        divider: 'Demais informações do produto',
        property: 'tipo',
        label: 'Tipo',
        placeholder:'Digite o tipo do produto',
        options: [
          { value: 'PA', label: 'PA' },
          { value: 'PI', label: 'PI' },
          { value: 'MP', label: 'MP' },
          { value: 'KT', label: 'KT' },
          { value: 'EM', label: 'EM' },
        ],
        gridColumns: 6
      },
      {
        property: 'armazem',
        label: 'Armazém',
        placeholder:'Digite o armazem do produto',
        type: 'string',
        gridColumns: 6
      },
    ];
   }

  ngOnInit(): void {
    this.itensDaTabela = [];
    this.getItens(1);
  }

  getItens(page: number = 1) {
    this.carregandoTabela = true;
    if (page === 1) this.itensDaTabela = [];
    this.produtosService
      .getAll(page, this.filtrosAplicados)
      .pipe(finalize(() => (this.carregandoTabela = false)))
      .subscribe((res) => {
        this.itensDaTabela = this.itensDaTabela.concat(res.items);
      });
  }

  carregarMais():void{
    this.page++;
    this.getItens(this.page);
    console.log(this.filtrosAplicados);
  }

  // private onClick(){
  //   alert('Clicked in menu item');
  // }

  salvarFormulario(): void {
    this.edicao
      ? this.produtosService.put(this.dynamicForm.value.codigo, this.dynamicForm.value).subscribe({
          next: alteraDados => {
            this.poNotificationService.success("Produto Alterado com sucesso");
            this.getItens();
            this.poModal.close();
          },
          error: (err) => {
            this.poNotificationService.error(err);
          },
        })
      : this.produtosService.post(this.dynamicForm.value).subscribe({
          next: incluiDados => {
            this.poNotificationService.success("Produto cadastrado com sucesso");
            this.getItens();
            this.poModal.close();
          },
          error: (err) => {
            this.poNotificationService.error(err);
          }
      })
  }

  buscaProduto(produto: string): void{ 
    this.filtrosAplicados = produto;
    this.page = 1;
    produto.length > 0 ? this.filtrosAplicados = 'codigo=' + produto : this.filtrosAplicados = '';
    
    this.getItens(this.page);
  }

  retornaBuscaAvancada(): PoPageDynamicSearchFilters[] {
    return [
      { property: 'codigo', type: 'Código', gridColumns: 12, divider: 'Cadastro de Produto' },
      { property: 'descricao', type: 'string', gridColumns: 12 },
      {
        property: 'tipo',
        options: [
          { value: 'PA', label: 'PA' },
          { value: 'PI', label: 'PI' },
          { value: 'MP', label: 'MP' },
          { value: 'KT', label: 'KT' },
          { value: 'EM', label: 'EM' },
        ],
      },
    ]
  }

  realizaBuscaAvancada(retornoBuscaAvancada: {[key: string]: QueryParamsType;}): void {
    this.filtrosAplicados = '';
    for(let atributo in retornoBuscaAvancada){
      if(retornoBuscaAvancada.hasOwnProperty(atributo)){
        this.filtrosAplicados += `${atributo}=${retornoBuscaAvancada[atributo]}&`;
      }
    }
    this.page = 1;
    this.getItens();
  }

  clickDisclaimers(e: any[]){
    this.filtrosAplicados = '';
    this.page = 1;
    if(e.length === 0){
      this.getItens();
    }else{
      e.map( (disclaimer) => { (this.filtrosAplicados += `${disclaimer.property}=${disclaimer.value}&`)})
      this.getItens();
    }
  }

  editarItem(linha: Produtos){
    this.edicao = true;
    this.produto['codigo'] = linha.codigo;
    this.produto['descricao'] = linha.descricao;
    this.produto['tipo'] = linha.tipo;
    this.produto['armazem'] = linha.armazem;

    this.poModal.open();
  }

  retornaColuna(): Array<PoTableColumn>{
    return [
      {
        property: 'codigo',
        label: 'Código',
        width: '30%',
      },
      {
        property: 'descricao',
        label: 'Descrição',
        width: '30%',
      },
      {
        property: 'tipo',
        label: 'Tipo Produto',
        width: '30%',
      },
    ]
  }

  incluiProduto(): void{
    this.edicao = false;
    this.dynamicForm.form.reset();
    this.poModal?.open();
  }

  excluirProduto(linha: Produtos) {
    
    if( !window.confirm("Confirma exclusão do produto ?")){
      return
    }

    this.carregandoTabela = true;
    this.produtosService.delete(linha.codigo).pipe(finalize(() => (this.carregandoTabela = false))).subscribe({
      next: grvDados =>{
        this.poNotificationService.success('Produto deletado com sucesso');
        this.buscaProduto(linha.codigo);
      },
      error: (error) =>{
        this.poNotificationService.error('Erro ao excluir o produto');
      }
    });
  }



}
