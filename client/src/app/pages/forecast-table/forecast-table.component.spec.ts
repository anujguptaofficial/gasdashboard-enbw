import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AgGridModule } from "@ag-grid-community/angular";
import { IDatasource, IGetRowsParams } from "@ag-grid-community/core";

import { CountryScenarioStoreService } from "../../services/api-store-service/country-scenario-store.service";
import { SharedService } from "../../services/shared-service/shared.service";
import { ApiService } from "../../services/api-service/api.service";
import { ForecastTableComponent } from "./forecast-table.component";

jest.mock("@ag-grid-community/core", () => {
  const originalModule = jest.requireActual("@ag-grid-community/core");
  return {
    ...originalModule,
    VanillaFrameworkOverrides: jest.fn(),
    BaseComponentWrapper: jest.fn(),
  };
});

describe("ForecastTableComponent", () => {
  let component: ForecastTableComponent;
  let fixture: ComponentFixture<ForecastTableComponent>;
  let activeRouteMock: any;
  let forecastTableHeaderMock: any;
  let forecastTableDataMock: any;
  let routerMock: any;
  let sharedServiceMock: any;

  beforeEach(async () => {
    routerMock = {
      routeReuseStrategy: {
        shouldReuseRoute: (fn: (value: boolean) => void) => fn(false),
      },
      events: {
        subscribe: (fn: (value: Params) => void) =>
          fn({
            id: "test_id",
            url: "test_url",
          }),
      },
      url: "test_url",
    };

    activeRouteMock = {
      params: {
        subscribe: (fn: (value: Params) => void) =>
          fn({
            tab: 0,
          }),
        api: {
          setDatasource: jest.fn(),
        },
      },
    };

    forecastTableHeaderMock = {
      getListofCountries: jest.fn(),
    };

    forecastTableDataMock = {
      getGasData: jest.fn(),
    };

    sharedServiceMock = {
      getRefreshGrid: jest.fn(),
      getGranularity: jest.fn(),
      getHeader: jest.fn(),
      setForecastError: jest.fn(),
      setErrorMessage: jest.fn(),
      csvToJSON: jest.fn(),
      setForecastRowData: jest.fn(),
      updateRowDataOnGranulairty: jest.fn(),
      updateGridData: jest.fn(),
      getToggleToPer: jest.fn(),
      getMonthForRows: jest.fn(),
      getMonth: jest.fn(),
      getScenario: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AgGridModule],
      declarations: [ForecastTableComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activeRouteMock,
        },
        {
          provide: CountryScenarioStoreService,
          useValue: forecastTableHeaderMock,
        },
        {
          provide: ApiService,
          useValue: forecastTableDataMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
        {
          provide: SharedService,
          useValue: sharedServiceMock,
        },
      ],
    }).compileComponents();
  });

  const response: any[] = [
    {
      name: "overview",
      visualization: "overview",
      forecastable: false,
      columns: [
        {
          id: "mktBalance",
          group: "first",
          percentage_display_name: "Balance % full",
          bcm_display_name: "Balance full",
          shortname: "MktBal",
          appearance: "balancing",
          visualisation: "",
        },
      ],
      displayname: "Overview",
    },
  ];

  const updatedResponse = [
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

  const gridResponse: any = `DATE,linepack,imp_production,stor_storage_modelled,con_industry,imp_uk,imp_de_h,imp_be_l,stor_storage_balance,imp_de_l,con_ldc,imp_be_h,imp_norway,imp_lng,mktBalance,balanceFull,modelledBalanceFull
    2023-02-06,,,,,,,,,,,,,,,,
    2023-01-30,,,,,,,,,,,,,,,,
    2023-01-23,2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0,-18.0,,`;

  const gridApiParams: any = {
    api: {
      setGridOption: jest.fn(),
      showNoRowsOverlay: jest.fn(),
      purgeInfiniteCache: jest.fn(),
      setDatasource: jest.fn(),
    },
    columnApi: "test_columnApi",
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastTableComponent);
    component = fixture.componentInstance;
    jest
      .spyOn(forecastTableHeaderMock, "getListofCountries")
      .mockReturnValue([of(false), of(response)]);
    jest
      .spyOn(forecastTableDataMock, "getGasData")
      .mockReturnValue(of(gridResponse));
    jest.spyOn(sharedServiceMock, "getGranularity").mockReturnValue(of(true));
    jest.spyOn(sharedServiceMock, "getRefreshGrid").mockReturnValue(of(true));
    jest.spyOn(sharedServiceMock, "getHeader").mockReturnValue(of(true));
    jest
      .spyOn(sharedServiceMock, "updateRowDataOnGranulairty")
      .mockReturnValue(of(true));
    jest.spyOn(sharedServiceMock, "updateGridData").mockReturnValue(of(true));
    jest.spyOn(sharedServiceMock, "getToggleToPer").mockReturnValue(of(true));
    jest.spyOn(sharedServiceMock, "getScenario").mockReturnValue(of("test"));
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should ngOnInit", () => {
    component.countryCode = "overview";
    jest
      .spyOn(forecastTableHeaderMock, "getListofCountries")
      .mockReturnValue([of(false), of(response)]);
    component.ngOnInit();
  });

  it("should ngAfterViewInit", () => {
    const response = [
      {
        colDef: {
          flex: 1,
          autoHeaderHeight: true,
          suppressMenu: true,
          minWidth: 110,
          headerName: "Date",
          field: "DATE",
          colId: "DATE",
          cellClassRules: {},
        },
      },
      {
        colDef: {
          flex: 1,
          autoHeaderHeight: true,
          suppressMenu: true,
          headerName: "Storage Balance",
          colId: "stor_storage_balance",
          field: "stor_storage_balance",
          cellClassRules: {},
        },
      },
    ];
    jest.spyOn(sharedServiceMock, "getHeader").mockReturnValue(of(response));
    component.ngAfterViewInit();
  });

  it("should onForecastHeaderInitalise", () => {
    component.countryCode = "overview";
    component.endDate = "60";
    component.selectedGranularity = "daily";
    jest
      .spyOn(forecastTableHeaderMock, "getListofCountries")
      .mockReturnValue([of(false), of(response)]);
    jest.spyOn(sharedServiceMock, "getMonthForRows").mockReturnValue(of(true));
    component.onForecastHeaderInitalise();
  });

  it("should onForecastHeaderInitalise displayname", () => {
    response[0].columns[0].displayname = "testing length should be more";
    component.countryCode = "overview";
    jest
      .spyOn(forecastTableHeaderMock, "getListofCountries")
      .mockReturnValue([of(false), of(response)]);
    component.onForecastHeaderInitalise();
  });

  it("should forecastTableContent", fakeAsync(() => {
    component.gridApi = gridApiParams.api;
    component.endDate = "60";
    component.scenarioValue = " ";

    const dataSource: IDatasource = {
      rowCount: undefined,
      getRows: jest.fn((params: IGetRowsParams): void => {
        params.successCallback([], 0);
      }),
    };
    jest.spyOn(gridApiParams.api, "setDatasource").mockImplementation((ds) => {
      expect(ds).toBe(dataSource);
    });
    jest
      .spyOn(forecastTableDataMock, "getGasData")
      .mockReturnValue(
        throwError(() => new Error("Some error occured, please try again"))
      );
    jest.spyOn(forecastTableDataMock, "getGasData").mockReturnValue(of(true));
    component.forecastTableContent();
    tick(1500);
    jest.runAllTimers();
    expect(component.isForecaseGridReady).toBe(false);
  }));

  it("should updatedForecaseGridData", () => {
    component.isForecaseGridReady = true;
    component.gridApi = gridApiParams.api;
    component.endDate = "60";
    jest
      .spyOn(forecastTableDataMock, "getGasData")
      .mockReturnValue(of(gridResponse));
    jest.spyOn(sharedServiceMock, "csvToJSON").mockReturnValue(updatedResponse);
    component.updatedForecastGridData();
  });

  it("should updatedForecaseGridData Error", () => {
    const errorMessage: any = {
      status: 502,
    };
    component.isForecaseGridReady = true;
    component.gridApi = gridApiParams.api;
    component.endDate = "60";
    jest
      .spyOn(forecastTableDataMock, "getGasData")
      .mockReturnValue(throwError(() => new Error(errorMessage)));
    component.updatedForecastGridData();
  });

  it("should getSelectedGranularity", () => {
    jest
      .spyOn(sharedServiceMock, "getGranularity")
      .mockReturnValue(of(["daily", true]));
    component.getSelectedGranularity();

    jest
      .spyOn(sharedServiceMock, "getGranularity")
      .mockReturnValue(of("daily"));
    component.getSelectedGranularity();
  });

  it("should updateForecastOnToggle", () => {
    jest.spyOn(sharedServiceMock, "getToggleToPer").mockReturnValue(of(true));
    component.updateForecastOnToggle();
  });
});
