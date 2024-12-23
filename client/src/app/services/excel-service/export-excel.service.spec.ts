import { TestBed } from "@angular/core/testing";
import { ExcelExportService } from "./export-excel.service";
import { DownloadExcelColumns } from "../../common/interfaces/table.interface";

describe("ExportExcelService", () => {
  let service: ExcelExportService;
  let excelServiceMock: any;

  beforeEach(() => {
    excelServiceMock = {
      exportExcel: jest.fn(),
    };
    global.URL.createObjectURL = jest.fn();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelExportService);
  });

  const gridData = [
    {
      DATE: new Date(),
      imp_de_l: "",
      imp_uk: "",
      imp_lng: "",
      modelled_storage: "",
      stor_storage_balance: "",
      imp_be_h: "",
      con_industry: "",
      linepack: "",
      imp_de_h: "",
      imp_norway: "",
      imp_be_l: "",
      imp_production: "",
      con_ldc: "",
      mktBalance: "",
      modelled_storage_full: "",
      balance_storage_full: "",
    },
    {
      DATE: "2023-07-14",
      imp_de_l: "-6",
      imp_uk: "0",
      imp_lng: "63",
      modelled_storage: "",
      stor_storage_balance: "",
      imp_be_h: "3",
      con_industry: "",
      linepack: "",
      imp_de_h: "-4",
      imp_norway: "29",
      imp_be_l: "-1",
      imp_production: "",
      con_ldc: "",
      mktBalance: "",
      modelled_storage_full: "",
      balance_storage_full: "",
    },
    {
      DATE: "2023-07-13",
      imp_de_l: "-20",
      imp_uk: "0",
      imp_lng: "62",
      modelled_storage: "",
      stor_storage_balance: "2",
      imp_be_h: "29",
      con_industry: "",
      linepack: "",
      imp_de_h: "-4",
      imp_norway: "24",
      imp_be_l: "-10",
      imp_production: "",
      con_ldc: "",
      mktBalance: "84",
      modelled_storage_full: "",
      balance_storage_full: "",
    },
    {
      DATE: "2023-07-12",
      imp_de_l: "-18",
      imp_uk: "6",
      imp_lng: "58",
      modelled_storage: "",
      stor_storage_balance: "-41",
      imp_be_h: "29",
      con_industry: "-35",
      linepack: "",
      imp_de_h: "-20",
      imp_norway: "28",
      imp_be_l: "-10",
      imp_production: "26",
      con_ldc: "-13",
      mktBalance: "9",
      modelled_storage_full: "",
      balance_storage_full: "10641",
    },
    {
      DATE: "",
    },
  ];

  const reorderedHeaders: DownloadExcelColumns[] = [
    { id: "DATE", bcm_display_name: "Date" },
    { id: "mkt_balance", bcm_display_name: "Market Balance" }
  ];

  it("should exportExcel", () => {
    service.exportExcel(gridData, gridData, "test", reorderedHeaders);

    service.exportExcel(null, gridData, "test", reorderedHeaders);

    service.exportExcel(gridData, null, "test", reorderedHeaders);
  });

  it("should saveExcelFile", () => {
    service.saveExcelFile({}, "test");
  });
});
