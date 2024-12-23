import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-cell-renderer',
  templateUrl: './loading-cell-renderer.component.html'
})
export class LoadingCellRendererComponent implements ICellRendererAngularComp{
  public isLoading: boolean = true;
  public value: any;

  agInit(params: any): void {
    setTimeout(() => {
      this.isLoading = false;
      this.value = params.value;
    }, 1000);
  }

  refresh(params: any): boolean {
    return false;
  }
}
