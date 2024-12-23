import { AgGridModule } from "@ag-grid-community/angular";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BricksUiModule } from "@enbw_bricks/ui";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatTableModule } from "@angular/material/table";
import { MatAutocompleteModule } from "@angular/material/autocomplete";

import { HistoricTableRoutingModule } from "../pages/historic-table/historic-table-routing.module";
import { Navbar } from "../pages/layout-navbar/navbar.component";
import { HistoricTableComponent } from "../pages/historic-table/historic-table.component";
import { CustomHeaderGroup } from "../pages/custom-aggridComponent/customtableheader/custom-header-group.component";
import { DownloadExcelComponent } from "../common/modals/download-excel/download-excel.component";
import { UploadExcelComponent } from "../common/modals/upload-excel/upload-excel.component";
import { ForecastTableComponent } from "../pages/forecast-table/forecast-table.component";
import { IndexComponent } from "./index.component";
import { CustomNoRowsOverlay } from "../pages/custom-aggridComponent/custom-norows-overlay/custom-norows-overlay.component";
import { CopyPasteComponent } from "../common/modals/upload-excel/copypaste-upload/copypaste-upload.component";
import { KeyeventDirectiveDirective } from "../common/modals/upload-excel/keyevent-directive.directive";
import { HighchartTablesComponent } from "../common/modals/highchart-tables/highchart-tables.component";
import { LoadingCellRendererComponent } from "../pages/custom-aggridComponent/loading-cell-renderer/loading-cell-renderer.component";
import { HomeComponent } from "../pages/home/home.component";

@NgModule({
  declarations: [
    HistoricTableComponent,
    Navbar,
    DownloadExcelComponent,
    CustomHeaderGroup,
    UploadExcelComponent,
    ForecastTableComponent,
    IndexComponent,
    CustomNoRowsOverlay,
    CopyPasteComponent,
    KeyeventDirectiveDirective,
    HighchartTablesComponent,
    LoadingCellRendererComponent,
    HomeComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HistoricTableRoutingModule,
    BricksUiModule,
    MatSelectModule,
    AgGridModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatDatepickerModule,
    MatTableModule,
  ],
})
export class IndexModule {}
