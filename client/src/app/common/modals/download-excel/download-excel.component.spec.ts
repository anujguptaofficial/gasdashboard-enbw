import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { of, throwError } from "rxjs";
import { ToastrService } from "ngx-toastr";

import { DownloadExcelComponent } from "./download-excel.component";
import { ApiService } from "../../../services/api-service/api.service";
import { SharedService } from "../../../services/shared-service/shared.service";
import { ExcelExportService } from "../../../services/excel-service/export-excel.service";
import { CONSTANTS } from "../../utils/constant";
import { formatDate } from "@angular/common";

type MatDialogRefMock = {
  close: jest.Mock
}

describe("DownloadExcelComponent", () => {
  let component: DownloadExcelComponent;
  let fixture: ComponentFixture<DownloadExcelComponent>;
  let downloadSelectedMock: jest.Mocked<ApiService>;
  let exportServiceMock: jest.Mocked<ExcelExportService>;
  let sharedServiceMock: jest.Mocked<SharedService>;
  let dialogRefMock: MatDialogRefMock;
  let toastServiceMock: any;

  beforeEach(async () => {
    sharedServiceMock = {
      getRowHeader: jest.fn(),
      getGranularity: jest.fn(),
      getScenario: jest.fn(),
      getCountryCode: jest.fn(),
      csvToJSON: jest.fn(),
      setNotifyRes: jest.fn(),
      getToggleToPer: jest.fn(),
    } as unknown as jest.Mocked<SharedService>;

    downloadSelectedMock = {
      getGasData: jest.fn()
    } as unknown as jest.Mocked<ApiService>;

    exportServiceMock = {
      exportExcel: jest.fn(),
    } as unknown as jest.Mocked<ExcelExportService>;

    dialogRefMock = {
      close: jest.fn(),
    };

    toastServiceMock = {
      toastr: jest.fn(),
      warning: jest.fn(),
      success: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [DownloadExcelComponent],
      providers: [
        {
          provide: ApiService,
          useValue: downloadSelectedMock,
        },
        {
          provide: ExcelExportService,
          useValue: exportServiceMock,
        },
        {
          provide: SharedService,
          useValue: sharedServiceMock,
        },
        { provide: ToastrService, useValue: toastServiceMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadExcelComponent);
    component = fixture.componentInstance;
  });

  const mockedHeaderColumns:any = [
    { id: 'DATE', bcm_display_name: 'Date' },
    { id: 'mkt_balance', bcm_display_name: 'Market Balance' }
  ]

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should ngOnInit", () => {
    jest
      .spyOn(sharedServiceMock, "getGranularity")
      .mockReturnValue(of("daily"));
    jest.spyOn(sharedServiceMock, "getCountryCode").mockReturnValue(of("nl"));
    jest.spyOn(sharedServiceMock, "getToggleToPer").mockReturnValue(of(true));
    jest.spyOn(sharedServiceMock, "getRowHeader").mockReturnValue(of(mockedHeaderColumns));
    component.ngOnInit();
    expect(component.toggleRowData).toBeTruthy();

    jest
      .spyOn(sharedServiceMock, "getGranularity")
      .mockReturnValue(of("weekly"));
    component.ngOnInit();
    expect(component.selectedGranularity).toEqual("daily");
    jest.spyOn(sharedServiceMock, "getToggleToPer").mockReturnValue(of(false));
    component.ngOnInit();
    expect(component.toggleRowData).toBeFalsy();
  });

  it("should get getFromDate", () => {
    const fromDateEvent = {
      value: new Date(),
    };
    const fromDate = formatDate(
      fromDateEvent.value,
      CONSTANTS.FORMAT_DATE_DD,
      "en"
    );
    component.getFromDate(fromDateEvent);

    expect(component.fromDateObj).toEqual(fromDateEvent.value);
    expect(component.fromDate).toEqual(fromDate);
  });

  it(" should get getToDate", () => {
    const toDateEvent = {
      value: new Date(),
    }
    const toDate = formatDate(toDateEvent.value, CONSTANTS.FORMAT_DATE_DD, "en");
    component.getToDate(toDateEvent)
    expect(component.toDateObj).toEqual(toDateEvent.value);
    expect(component.toDate).toEqual(toDate)
  })

  const gridResponse = `DATE,imp_be_h,imp_de_l,imp_be_l,stor_storage_balance,imp_de_h,stor_storage_base,stor_storage_modelled_balance,stor_storage_max_capacity,imp_norway,XXX_storage_capacity,con_ldc,linepack,con_industry,imp_uk,imp_production,imp_lng,stor_storage_modelled,stor_storage_normal_balance,mktBalance,balanceFull,modelledBalanceFull
    2022-11-25,0.0,-58.24,-23.9,58.97,-2.12,,,,0.0,,-83.26,0.0,0.0,30.24,86.74,89.96,0.0,,19.550000000000026,,
    2022-11-24,0.0,-62.43,-60.35,63.54,-3.56,,,,0.0,,-85.92,0.0,0.0,30.24,88.02,224.9,0.0,,-67.35999999999999,,`;

  it("should download History data", () => {
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    component.fromDate = "2022-11-25";
    component.toDate = formattedDate;
    jest
      .spyOn(downloadSelectedMock, "getGasData")
      .mockReturnValue(of(gridResponse));
    const selectedDownloadSpy = jest.spyOn(component, "selectDownloadData");
    component.downloadFile();
    expect(component.requestedHistory).toBeTruthy();
    expect(selectedDownloadSpy).toHaveBeenCalledWith("2022-11-25", formattedDate, "history", CONSTANTS.DEFAULT);
  });

  it("should download Forecast data", () => {
    jest.spyOn(localStorage["__proto__"], 'getItem').mockImplementation((key: any) => {
      if (key === 'scenarioUpdate') return 'default'; 
      return ;
    });
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    const toDate = nextDay.toISOString().substring(0, 10);
    const formattedDate = today.toISOString().substring(0, 10);
    component.toDate = toDate;
    component.fromDate = "2024-12-17";
    jest
      .spyOn(downloadSelectedMock, "getGasData")
      .mockReturnValue(of(gridResponse));
    const selectedDownloadSpy = jest.spyOn(component, "selectDownloadData");
    component.downloadFile();
    expect(selectedDownloadSpy).toHaveBeenCalledWith(formattedDate, toDate, "forecast", CONSTANTS.DEFAULT);
  });

  it("should display error on invalid date range ", () => {
    jest
      .spyOn(downloadSelectedMock, "getGasData")
      .mockReturnValue(of(gridResponse));
    component.fromDate = "2024-12-25";
    component.toDate = "2024-12-05";
    const checkDateRangeSpy = jest.spyOn(component, "checkDateRange");
    component.downloadFile();
    expect(checkDateRangeSpy).toHaveBeenCalled();
    expect(component.downloadError).toEqual(CONSTANTS.CORRECT_DATE_RANGE);
  });

  it("should verifyExportData", () => {
    component.requestedForecast = true;
    component.requestedHistory = true;
    component.verifyExportData();
    expect(toastServiceMock.success).toHaveBeenCalledWith(
      "Downloaded successfully! select date range to download another file",
      "Success",
      {
        positionClass: "toast-bottom-right",
      }
    );
    expect(exportServiceMock.exportExcel).toHaveBeenCalledWith([], [], CONSTANTS.GASDATA, []);
  });

  it("should verifyExportData response data conditions", () => {
    component.forecastData = null;
    component.historyData = null;
    component.verifyExportData();
  });

  it("should closeDialog", () => {
    component.closeDialog();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it("should resetDatePicker", () => {
    component.emptyfromDate = {
      nativeElement: { value: "emptyfromDateTestValue" },
    };
    component.emptyToDate = {
      nativeElement: { value: "emptyToDateTestValue" },
    };
    component.resetDatePicker();
    expect(component.fromDate).toEqual('');
    expect(component.toDate).toEqual('')
  });

  it("should downloadFile error", () => {
    let errorMessage: any = {
      error: {
        error: "Error test message",
      },
    };
    jest
      .spyOn(downloadSelectedMock, "getGasData")
      .mockReturnValue(throwError(() => new Error(errorMessage)));
    component.selectDownloadData("2022-11-25", "2023-11-25", "history", CONSTANTS.DEFAULT);
    component.selectDownloadData("2024-12-06", "2024-12-08", "forecast", CONSTANTS.DEFAULT);

    let errorMsgFirstLoop: any = {
      status: 502,
      error: {
        error: "Error test message",
      },
    };
    const now = new Date();
    const yesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1
    );
    component.fromDateObj = now;
    component.toDateObj = yesterday;
    jest
      .spyOn(downloadSelectedMock, "getGasData")
      .mockReturnValue(throwError(() => new Error(errorMsgFirstLoop)));
    component.selectDownloadData("2022-11-25", "2023-11-25", "history", CONSTANTS.DEFAULT);
    component.selectDownloadData("2024-12-06", "2024-12-08", "forecast", CONSTANTS.DEFAULT);

    component.fromDateObj = yesterday;
    component.toDateObj = now;
    jest
      .spyOn(downloadSelectedMock, "getGasData")
      .mockReturnValue(throwError(() => new Error(errorMsgFirstLoop)));
    component.selectDownloadData("2022-11-25", "2023-11-25", "history", CONSTANTS.DEFAULT);
    component.selectDownloadData("2024-12-06", "2024-12-08", "forecast", CONSTANTS.DEFAULT);

    let errorMsgsecondLoop: any = {
      status: 409,
      error: {
        error: "Error test message",
      },
    };
    jest
      .spyOn(downloadSelectedMock, "getGasData")
      .mockReturnValue(throwError(() => new Error(errorMsgsecondLoop)));
    component.selectDownloadData("2022-11-25", "2023-11-25", "history", CONSTANTS.DEFAULT);
    component.selectDownloadData("2024-12-06", "2024-12-08", "forecast", CONSTANTS.DEFAULT);

    let errorMsgThirdLoop: any = {
      status: 401,
      error: {
        error: "Error test message",
      },
    };
    jest
      .spyOn(downloadSelectedMock, "getGasData")
      .mockReturnValue(throwError(() => new Error(errorMsgThirdLoop)));
    component.selectDownloadData("2022-11-25", "2023-11-25", "history", CONSTANTS.DEFAULT);
    component.selectDownloadData("2024-12-06", "2024-12-08", "forecast", CONSTANTS.DEFAULT);
  });
});
