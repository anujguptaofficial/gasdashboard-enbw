import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { of, throwError } from "rxjs";

import { UploadExcelComponent } from "./upload-excel.component";
import { ApiService } from "../../../services/api-service/api.service";
import { SharedService } from "../../../services/shared-service/shared.service";
import { CountryScenarioStoreService } from "../../../services/api-store-service/country-scenario-store.service";

describe("UploadExcelComponent", () => {
  let component: UploadExcelComponent;
  let fixture: ComponentFixture<UploadExcelComponent>;
  let uploadForecastMock: any;
  let dialogMock: any;
  let sharedServiceMock: any;
  let dataMock: any;
  let dialogRefMock: any;
  let CountryScenarioStoreServiceMock: any;
  let toastServiceMock: any;
  let countriesMock: any;

  beforeEach(async () => {
    countriesMock = {
      getListofCountries: jest.fn(),
    };
    uploadForecastMock = {
      uploadForecast: jest.fn(),
    };

    sharedServiceMock = {
      getCountryCode: jest.fn(),
      getRowHeader: jest.fn(),
      setDropDownChange: jest.fn(),
      setNotifyRes: jest.fn(),
      getDisplayName: jest.fn(),
      getCountryScenarioModes: jest.fn(),
      getAllCountryCodes: jest.fn(),
    };

    dialogRefMock = {
      close: jest.fn(),
    };

    CountryScenarioStoreServiceMock = {
      getListofScenarios: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [UploadExcelComponent],
      providers: [
        {
          provide: ApiService,
          useValue: uploadForecastMock,
        },
        {
          provide: CountryScenarioStoreService,
          useValue: countriesMock,
        },
        {
          provide: MatDialog,
          useValue: dialogMock,
        },
        {
          provide: SharedService,
          useValue: sharedServiceMock,
        },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: dataMock },
        { provide: ToastrService, useValue: toastServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadExcelComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  const scenarioData = {
    forecast_modes: {
      "Short Term": "forecast_short_term",
      "Mid Term": "forecast_mid_term",
      "Long Term": "forecast_longterm",
    },
    scenario_modes: {
      at: ["default"],
      be: ["default"],
      cz: ["default"],
      de: ["default"],
      fr: ["default"],
      it: ["default"],
      nl: ["default"],
      nwe_overview: ["default"],
      sk: ["default"],
      uk: ["default"],
    },
  };
  const countryCodes = [
    "at",
    "be",
    "de",
    "cz",
    "fr",
    "it",
    "nl",
    "nwe_overview",
    "sk",
    "uk",
  ];

  it("should ngOnInit", () => {
    jest.spyOn(sharedServiceMock, "getCountryCode").mockReturnValue(of(true));
    jest.spyOn(sharedServiceMock, "getDisplayName").mockReturnValue(of(true));
    jest
      .spyOn(sharedServiceMock, "getAllCountryCodes")
      .mockReturnValue(of(countryCodes));
    jest
      .spyOn(sharedServiceMock, "getCountryScenarioModes")
      .mockReturnValue(of(scenarioData));
    component.ngOnInit();
  });

  it("should call onSelectForecast", () => {
    component.onSelectForecast({});
  });

  it("should call onFileSelected if condition", async () => {
    component.selectedFile = jest.fn(() => "details");
    const mFile = new File(["test"], "test.xlsx");
    const mEvent = { target: { files: [mFile] } };
    const readAsBinaryStringSpy = jest.spyOn(
      FileReader.prototype,
      "readAsBinaryString"
    );
    const pauseFor = (milliseconds: any) =>
      new Promise((resolve) => setTimeout(resolve, milliseconds));
    await pauseFor(1000);
    component.onFileSelected(mEvent);
    expect(readAsBinaryStringSpy).toBeCalledWith(mFile);
  });

  it("should onFileSelected else condition", () => {
    const mFile = new File(["test_upload_else"], "test_upload_else.xlsx");
    const mEvent = { target: { files: [mFile] } };
    const readAsBinaryStringSpy = jest.spyOn(
      FileReader.prototype,
      "readAsBinaryString"
    );
    component.onFileSelected(mEvent);
    expect(readAsBinaryStringSpy).toBeCalledWith(mFile);
  });

  const getRowHeader = [
    {
      id: "balanceFull",
      group: "p_balance",
      displayname: "Balance % full",
      shortname: "% Full",
      appearance: "primary_color",
      visualisation: "",
    },
    {
      id: "con_industry",
      group: "consumption",
      displayname: "Industry",
      shortname: "In",
      appearance: "primary_color",
      visualisation: "",
    },
  ];

  it("should uploadForecast", () => {
    component.pastedCSV = "testcsv";
    component.scenarioText = "test_scenario";
    jest.spyOn(uploadForecastMock, "uploadForecast").mockReturnValue(of(true));
    jest
      .spyOn(sharedServiceMock, "getRowHeader")
      .mockReturnValue(of(getRowHeader));
    component.uploadFile();
    component.scenarioText = " ";
    component.uploadFile();
    component.sheetName = "test_csv";
    component.scenarioText = "test_scenario";
    component.uploadFile();
  });

  it("should uploadForecast error", () => {
    let errorMessage: any = {
      error: {
        error: "Error test message",
      },
    };
    jest
      .spyOn(uploadForecastMock, "uploadForecast")
      .mockReturnValue(throwError(() => new Error(errorMessage)));
    component.errorMessage = errorMessage.error.error;
    component.uploadFile();
  });

  it("should resetInputField", () => {
    component.inputFile = {
      nativeElement: {
        value: "",
      },
    };
    component.selectedFile = true;
    component.selectedFileName = "Choose another file";
    component.resetInputField();
  });

  it("should getPastedData", () => {
    component.getPastedData(["test", "test2", "test3"]);

    component.getPastedData([]);
  });

  it("should changeView", () => {
    component.changeView();
  });

  it("should jumpToPasteDialog", () => {
    component.jumpToPasteDialog();
  });

  const uploadResponse = [
    {
      DATE: "2022-01-01",
      con_industry: "208.77333333333334",
      imp_be_h: "0.0",
      imp_de_h: "-10.607",
      stor_storage_balance: "115.61966666666667",
      imp_production: "211.7852",
      imp_norway: "24.976",
      imp_be_l: "-87.60300000000001",
      imp_uk: "-5.449",
      imp_lng: "182.78966666666665",
      linepack: "",
      con_ldc: "-288.10400000000004",
      imp_de_l: "-122.60100000000001",
      mktBalance: "57.77033333333334",
      balanceFull: "",
      modelledBalanceFull: "",
    },
    {
      DATE: "2023-01-01",
      con_industry: "23.677500000000002",
      imp_be_h: "0.0",
      imp_de_h: "-1.5811111111111111",
      stor_storage_balance: "0.43666666666666665",
      imp_production: "",
      imp_norway: "21.397777777777776",
      imp_be_l: "-8.623000000000001",
      imp_uk: "-0.17555555555555558",
      imp_lng: "25.264444444444443",
      linepack: "",
      con_ldc: "-40.92",
      imp_de_l: "-33.67111111111112",
      mktBalance: "13.062222222222223",
      balanceFull: "",
      modelledBalanceFull: "",
    },
    {
      DATE: "2022-12-05",
      imp_production: "380.15857142857146",
      imp_de_l: "-255.72714285714287",
      imp_de_h: "-23.28142857142857",
      imp_lng: "352.8142857142857",
      imp_be_h: "",
      con_industry: "463.07714285714286",
      stor_storage_balance: "270.56",
      con_ldc: "-562.6471428571429",
      imp_uk: "-14.047142857142857",
      imp_norway: "",
      linepack: "",
      imp_be_l: "-153.44714285714286",
      mktBalance: "83.66000000000001",
      balanceFull: "",
      modelledBalanceFull: "",
    },
    {
      DATE: "2022-12-12",
      imp_production: "229.30714285714288",
      imp_de_l: "-133.34",
      imp_de_h: "-13.994285714285715",
      imp_lng: "244.47714285714287",
      imp_be_h: "",
      con_industry: "279.49285714285713",
      stor_storage_balance: "147.2342857142857",
      con_ldc: "-428.3514285714286",
      imp_uk: "-9.034285714285714",
      imp_norway: "",
      linepack: "",
      imp_be_l: "-152.56",
      mktBalance: "131.23714285714283",
      balanceFull: "",
      modelledBalanceFull: "",
    },
  ];

  it("should arrayToCSV", () => {
    component.arrayToCSV(uploadResponse);
  });

  it("should closeDialog", () => {
    component.closeDialog();
  });

  it("should uploadForecastData", () => {
    const response = {
      name: "nl",
      visualization: "nl",
      columns: [
        {
          id: "mktBalance",
          group: "first",
          displayname: "Market Balance",
          shortname: "MktBal",
          appearance: "balancing",
          visualisation: "",
        },
      ],
      displayname: "Netherlands",
    };
    jest
      .spyOn(countriesMock, "getListofCountries")
      .mockReturnValue([of(false), of(response)]);

    const errorMessage: any = {
      status: 406,
      error: {
        error: "error_text",
      },
    };
    component.scenarioText = " ";
    jest
      .spyOn(uploadForecastMock, "uploadForecast")
      .mockReturnValue(throwError(errorMessage));
    component.uploadForecastData("testcsv", "nl");

    let errorMsgFirstLoop: any = {
      status: 502,
      error: {
        error: "Error test message",
      },
    };
    jest
      .spyOn(uploadForecastMock, "uploadForecast")
      .mockReturnValue(throwError(errorMsgFirstLoop));
    component.uploadForecastData("testcsv", "nl");

    let errorMsgsecondLoop: any = {
      status: 409,
      error: {
        error: "Error test message",
      },
    };
    jest
      .spyOn(uploadForecastMock, "uploadForecast")
      .mockReturnValue(throwError(errorMsgsecondLoop));
    component.uploadForecastData("testcsv", "nl");

    let errorMsgThirdLoop: any = {
      status: 401,
      error: {
        error: "Error test message",
      },
    };
    jest
      .spyOn(uploadForecastMock, "uploadForecast")
      .mockReturnValue(throwError(errorMsgThirdLoop));
    component.uploadForecastData("testcsv", "nl");

    let errorMsgForthLoop: any = {
      status: 408,
      error: {
        error: "Error test message",
      },
    };
    jest
      .spyOn(uploadForecastMock, "uploadForecast")
      .mockReturnValue(throwError(errorMsgForthLoop));
    component.uploadForecastData("testcsv", "nl");
  });

  it("should onSelectedScenario", () => {
    component.onSelectedScenario("Test");
  });
});
