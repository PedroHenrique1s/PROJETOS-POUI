import { Component, OnInit } from '@angular/core';
import { Supplier } from '../model/supplierModel';
import { FornecedorFormService } from './fornecedor-form.service';
import { PoDynamicFormField, PoNotificationService } from '@po-ui/ng-components';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';

@Component({
  selector: 'app-fornecedor-form',
  templateUrl: './fornecedor-form.component.html',
  styleUrls: ['./fornecedor-form.component.css']
})
export class FornecedorFormComponent implements OnInit {


  supplier: Supplier = new Supplier();//model de um forncedor
  supplierValues = {    type: 2, code: "", storeId: "", shortName: "", name: "", strategicCustomerType: "J", entityType: "J",
    number: "", address: "", zipCode: "", stateId: "", stateInternalId: "", registerSituation: "1",
    stateDescription: "", complement: "", district: "", cityCode: "", cityDescription: ""
  }; //array com os valores do fomulário
  supplierType: string | any = '2';
  supplierId: string | any;
  title = 'Inclusão de Fornecedor';  

  constructor(private FornecedorFormService: FornecedorFormService,
    private poNotification: PoNotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    //Define valores padrão para formulário
    this.supplierValues = {
      type: 2, code: "", storeId: "", shortName: "", name: "", strategicCustomerType: "J", entityType: "J",
      number: "", address: "", zipCode: "", stateId: "", stateInternalId: "",registerSituation: "1",
      stateDescription: "", complement: "", district: "", cityCode: "", cityDescription: ""
    }
    this.route.paramMap.subscribe(parameters => {
      this.supplierId = parameters.get('id');
      this.supplierType = parameters.get('type');
    });

    if (this.supplierId){ //se tiver id na url, significa alteração
      this.title = 'Alteração de Fornecedor';
      this.setFormValue(); //Atribui os valores do API para o formulário
    }
  }
  //Método para inserir um novo fornecedor
  insertSupplier():void {
    this.getSupplierFromForm();
    this.FornecedorFormService.postNewSupplier(JSON.stringify(this.supplier)).pipe(first()).subscribe(() => {
      this.poNotification.success('Fornecedor foi inserido com Sucesso');
      this.router.navigate(['/fornecedor']); //redireciona para lista de fornecedor
    }, err =>{
      //se error devolve o erro do backend para o usuário
      let messErr = JSON.parse(err.error.errorMessage);
      this.poNotification.error(`Erro código ${messErr.code}, ${decodeURIComponent(escape(messErr.detailedMessage))}`)
    });
  }

  //Alimenta o modelo de dados
  private getSupplierFromForm(): void{
    // dados pessoais
    this.supplier.code = this.supplierValues.code;
    this.supplier.storeId = this.supplierValues.storeId;
    this.supplier.name = this.supplierValues.name;
    this.supplier.shortName = this.supplierValues.shortName;
    this.supplier.strategicCustomerType = this.supplierValues.strategicCustomerType;
    this.supplier.entityType = this.supplierValues.entityType;
    this.supplier.type = this.supplierValues.type;
    this.supplier.registerSituation = this.supplierValues.registerSituation;

    // Endereço
    this.supplier.address.address = this.supplierValues.address;
    this.supplier.address.city.cityCode = this.supplierValues.cityCode;
    this.supplier.address.city.cityDescription = this.supplierValues.cityCode;
    this.supplier.address.city.cityInternalId = this.supplierValues.cityCode;
    this.supplier.address.state.stateId = this.supplierValues.stateId;
    this.supplier.address.state.stateInternalId = this.supplierValues.stateId;
  }

  updateSupplier(): void {
    this.getSupplierFromForm();
    this.FornecedorFormService.putSupplier(this.supplier.code + this.supplier.storeId, JSON.stringify(this.supplier), 
    this.supplierType).pipe(first()).subscribe((supplier:Supplier) =>{
      this.poNotification.success('Fornecedor alterado com Sucesso');
      this.router.navigate(['/fornecedor']);//Redireciona para lista de fornecedores
    }, err => this.poNotification.error(err)); //exibe erro ao editar fornecedor
  }

  //Método para atribuir valores aos campos para formulário
  private setFormValue(): void {
    this.FornecedorFormService.getSupplier(this.supplierId, this.supplierType).pipe(first()).subscribe((supplier:Supplier) =>{
      console.log(supplier);
      this.supplierValues.code = supplier.code;
      this.supplierValues.storeId = supplier.storeId;
      this.supplierValues.name = supplier.name;
      this.supplierValues.shortName = supplier.shortName;
      this.supplierValues.strategicCustomerType = supplier.strategicCustomerType;
      this.supplierValues.entityType = supplier.strategicCustomerType;
      this.supplierValues.type = supplier.type;
      this.supplierValues.registerSituation = supplier.registerSituation;
      
      // Endereço
      this.supplierValues.address = supplier.address.address;
      this.supplierValues.cityCode = supplier.address.city.cityCode;
      this.supplierValues.cityCode = supplier.address.city.cityDescription;
      this.supplierValues.cityCode = supplier.address.city.cityInternalId;
      this.supplierValues.stateId = supplier.address.state.stateId;
      this.supplierValues.stateId = supplier.address.state.stateInternalId;
    });
  }

  fields: Array<PoDynamicFormField> = [
    {
      property: 'code',
      label: 'Código',
      divider: 'Dados Pessoais',
      maxLength: 6
    },
    {
      property:'storeId',
      label: 'Loja',
      maxLength: 2
    },
    {
      property: 'name',
      label: 'Name',
      maxLength: 40
    },
    {
      property: 'shortName',
      label: 'Nome Reduzido',
      maxLength: 20
    },
    {
      property: 'strategicCustomerType',
      label: 'Tipo do cliente',
      options: [
        { label: 'Cons. Final', value: 'F' },
        { label: 'Produtor Rural', value: 'L' },
        { label: 'Revendedor', value: 'R' },
        { label: 'Solidario', value: 'S' },
        { label: 'Exportação', value: 'X' }
      ]
    },
    {
      property: 'entityType',
      label: 'Tipo da entidade',
      options: [
        { label: 'Juridica', value: 'J' },
        { label: 'Fisica', value: 'F' }
      ]
    },
    {
      property: 'registerSituation', //Campo: A1_MSBLQL / A2_MSBLQL  == Status: 1 - Ativo, 2 - Inativo, 3 - Cancelado, 4 - Pendente, 5 -Suspenso
      label: 'Situação(MSBLQL)',
      options: [
        { label: 'Inativo', value: '1' },
        { label: 'Ativo', value: '2' }
      ]
    },
    {
      property: 'type',
      label: 'Tipo',
      options: [
        { label: 'Cliente', value: 1 },
        { label: 'Fornecedor', value: 2 }
      ]
    },
    {
      property: 'zipCode',
      label: 'CEP',
      divider: 'Endereço',
      maxLength: 9
    },
    {
      property: 'address',
      label: 'Endereço'
    },
    {
      property: 'cityCode',
      label: 'Cidade',
      options: [
        { label: 'Adolfo', value: '00204' },
        { label: 'São José do Rio Preto', value: '49805' },
        { label: 'José Bonifácio', value: '25706' },
        { label: 'Joinville', value: '09102' }
      ]
    },
    {
      property: 'stateId',
      label: 'Estado',
      options: [
        { label: 'Santa Catarina', value: 'SC' },
        { label: 'São Paulo', value: 'SP' },
        { label: 'Rio de Janeiro', value: 'RJ' },
        { label: 'Minas Gerais', value: 'MG' }
      ]
    }
  ]
}
