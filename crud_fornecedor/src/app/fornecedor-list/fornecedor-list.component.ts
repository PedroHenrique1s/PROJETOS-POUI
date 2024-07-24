import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoNotificationService,PoTableAction } from '@po-ui/ng-components';
import { FornecedorListService } from './fornecedor-list.service';

@Component({
  selector: 'app-fornecedor-list',
  templateUrl: './fornecedor-list.component.html',
  styleUrls: ['./fornecedor-list.component.css']
})
export class FornecedorListComponent implements OnInit {

  supplierList: Array<any> = new Array();
  colunasTable: Array<any> = new Array();

  actions: Array<PoTableAction> = [
    {action: this.updateSupplier.bind(this), icon: 'po-icon-edit'  , label: 'Alterar Fornecedor'},
    {action: this.deleteSupplier.bind(this), icon: 'po-icon-delete', label: 'Excluir Fornecedor'},
  ];

  updateSupplier(row:any){
    console.log('Edit');
    const supplierId = row.code + row.storeId;
    this.router.navigate([`/fornecedorform/${supplierId}/${row.type}`]);
  }

  deleteSupplier(row:any){
    console.log('deleteSupplier');
    const supplierId = row.code + row.storeId;
    this.FornecedorListService.deleteSupplier(supplierId, row.type).subscribe(() => {
      this.updateSupplierList();
      this.poNotification.success('o Fornecedor foi excluido com sucesso');
    }, err => this.poNotification.error(err));
  }

  constructor(private FornecedorListService: FornecedorListService,
    private router: Router,
    private poNotification: PoNotificationService) { }

  ngOnInit(): void {
    this.updateSupplierList(); //busca lista de fornecedores da nossa api 
    this.colunasTable = this.FornecedorListService.getColumns();
  }

  updateSupplierList(): void {
    this.FornecedorListService.getSupplierList().subscribe(response => {
      this.supplierList = response.items;
    });
  }

}
