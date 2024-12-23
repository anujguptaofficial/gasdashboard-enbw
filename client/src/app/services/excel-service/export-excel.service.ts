import { Injectable } from "@angular/core";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { formatDate } from "@angular/common";

import { CONSTANTS } from "../../common/utils/constant";
import { DownloadExcelColumns } from "../../common/interfaces/table.interface";

@Injectable({
  providedIn: "root",
})
export class ExcelExportService {
  fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  fileExtension = ".xlsx";
  historyData: any;
  forecastData: any;

  exportExcel = (
    historyData: any,
    forecastData: any,
    fileName: string,
    reorderedHeaders: DownloadExcelColumns[]
  ) => {
    if ((historyData || forecastData) && fileName) {
      const currentDate: Date = new Date(
        formatDate(new Date(), CONSTANTS.FORMAT_DATE_DD, "en")
      );
      this.historyData = this.processData(historyData, currentDate, true, reorderedHeaders);
      this.forecastData = this.processData(forecastData, currentDate, false, reorderedHeaders);
      const combinedData = this.createCombinedData(
        this.historyData,
        this.forecastData
      );
      const combinedSheet = XLSX.utils.json_to_sheet(combinedData);
      this.styleHeader(combinedSheet);
      const workBook = this.createWorkBook(combinedSheet, fileName);
      this.addSheetToWorkBook(
        workBook,
        this.historyData,
        CONSTANTS.HISTORY_DATA
      );
      this.addSheetToWorkBook(
        workBook,
        this.forecastData,
        CONSTANTS.FORECAST_DATA
      );
      const excelData: ArrayBuffer = XLSX.write(workBook, {
        bookType: "xlsx",
        type: "array",
      });
      this.saveExcelFile(excelData, fileName);
    }
  };

  reorderColumnsHeader(data: any[], reorderedHeaders: DownloadExcelColumns[]): any[] {
    if (!data || !reorderedHeaders) return [];
    return data.map((row) => {
      const reorderedRow: any = {};
      reorderedHeaders.forEach((reorderedHeaders) => {
        reorderedRow[reorderedHeaders.bcm_display_name] =
        row[reorderedHeaders.id]  ?? "";
      });
      return reorderedRow;
    });
  }

  private processData(data: any, currentDate: Date, isHistory: boolean, reorderedHeaders: DownloadExcelColumns[]): any[] {
    if (!data) return [];
    data = [...data].reverse();
    let filteredData = data.filter((item: any) =>
      isHistory
        ? new Date(item.DATE) < currentDate
        : new Date(item.DATE) >= currentDate
    );
    if (reorderedHeaders) {
      filteredData = this.reorderColumnsHeader(filteredData, reorderedHeaders);
    }
    return filteredData;
  }

  private createCombinedData(historyData: any[], forecastData: any[]): any[] {
    return [
      { "": CONSTANTS.HISTORY_DATA, ...(historyData[0] || {}) },
      ...(historyData.slice(1) || []),
      { "": CONSTANTS.FORECAST_DATA, ...(forecastData[0] || {}) },
      ...(forecastData.slice(1) || []),
    ];
  }

  private styleHeader(sheet: XLSX.WorkSheet): void {
    const headerStyle = { alignment: { horizontal: "center" } };
    const headerRow = XLSX.utils.sheet_add_json(sheet, [{}], {
      skipHeader: true,
      origin: "A1",
    });
    for (let column in headerRow[0]) {
      headerRow[0][column].s = headerStyle;
    }
  }

  private createWorkBook(
    sheet: XLSX.WorkSheet,
    sheetName: string
  ): XLSX.WorkBook {
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, sheet, sheetName);
    return workBook;
  }

  private addSheetToWorkBook(
    workBook: XLSX.WorkBook,
    data: any[],
    sheetName: string
  ): void {
    if (data.length > 0) {
      const sheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workBook, sheet, sheetName);
    }
  }

  saveExcelFile = (buffer: any, fileName: string) => {
    if (buffer && fileName) {
      const data: Blob = new Blob([buffer], { type: this.fileType });
      saveAs(data, fileName + this.fileExtension, { autoBom: true });
    }
  };
}
