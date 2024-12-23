import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import * as XLSX from "xlsx";

import { UploadExcelComponent } from "../../common/modals/upload-excel/upload-excel.component";
import { ApiService } from "../../services/api-service/api.service";
import { SharedService } from "../../services/shared-service/shared.service";
import {
  ScenarioDetail,
  ExportTemplateSheetname,
} from "../../common/interfaces/header.interface";
import { StoreService } from "../../services/api-store-service/store.service";
import { CONSTANTS } from "../../common/utils/constant";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  protected excelFormat: StoreService;
  constructor(
    public router: Router,
    public dialog: MatDialog,
    private sharedService: SharedService,
    excelFormat: StoreService
  ) {
    this.excelFormat = excelFormat;
  }

  ngOnInit(): void {
    this.listOfScenarios();
  }

  uploadFile = (): void => {
    this.dialog.open(UploadExcelComponent);
  };

  generateExcelHeaders = () => {
    let headers: ExportTemplateSheetname[] = [];
    const excelHeaders = this.excelFormat.getListofCountries()[1];
    excelHeaders.subscribe((res) => {
      res.forEach((country) => {
        if (country.name !== "nwe_overview") {
          const countryHeaders = country.columns
            .filter((column: any) => column.manual_upload)
            .map((column) => column.id);
          if (countryHeaders.length > 0) {
            headers.push({ sheetName: country.name, headers: countryHeaders });
          }
        }
      });
    });
    return headers;
  };

  exportExcel = () => {
    const excelHeaders = this.generateExcelHeaders();
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    excelHeaders.forEach((sheet) => {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
      const headersWithDate = ["Date", ...sheet.headers];
      XLSX.utils.sheet_add_aoa(ws, [headersWithDate]);
      XLSX.utils.book_append_sheet(wb, ws, sheet.sheetName);
    });
    XLSX.writeFile(wb, CONSTANTS.FORECAST_TEMPLATE_FILENAME);
  };

  listOfScenarios = () => {
    const [_, scenarioList] = this.excelFormat.getListOfScenarios();
    scenarioList.subscribe((modes: ScenarioDetail | null) => {
      if (modes) {
        const scenarioModesForCountry: string[] = modes.scenario_modes["nwe_overview"];
        const scenarioNames = scenarioModesForCountry;
        this.sharedService.setCountryScenarioModes(scenarioNames);
      }
    });
  };
}
