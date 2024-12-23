import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ICellRendererParams } from "@ag-grid-community/core";

import { DownloadExcelComponent } from "../../../common/modals/download-excel/download-excel.component";

@Component({
  selector: "app-custom-header",
  templateUrl: "./custom-header-group.component.html",
  styleUrls: ["./custom-header-group.component.scss"],
})
export class CustomHeaderGroup {
  public params: any;

  constructor(public dialog: MatDialog) {}

  agInit(params: ICellRendererParams): void {
    if (params) {
      this.params = params;
    }
  }

  openDialog(): void {
    this.dialog.open(DownloadExcelComponent);
  }
}
