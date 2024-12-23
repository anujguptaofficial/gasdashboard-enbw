import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { AgGridModule } from "@ag-grid-community/angular";
import { of, throwError } from "rxjs";

import { HistoricTableComponent } from "./historic-table.component";
import { CountryScenarioStoreService } from "../../services/api-store-service/country-scenario-store.service";
import { SharedService } from "../../services/shared-service/shared.service";
import { ApiService } from "../../services/api-service/api.service";
import { BodyScrollEvent } from "../../common/interfaces/table.interface";

jest.mock("@ag-grid-community/core", () => {
  const originalModule = jest.requireActual("@ag-grid-community/core");
  return {
    ...originalModule,
    VanillaFrameworkOverrides: jest.fn(),
    BaseComponentWrapper: jest.fn(),
  };
});

describe("HistoricTableComponent", () => {
  let component: HistoricTableComponent;
  let fixture: ComponentFixture<HistoricTableComponent>;
  let activeRouteMock: any;
  let tableHeaderMock: any;
  let tableContentMock: any;
  let routerMock: any;
  let sharedServiceMock: any;

  beforeEach(async () => {
    routerMock = {
      routeReuseStrategy: {
        shouldReuseRoute: (fn: (value: boolean) => void) => fn(false),
      },
      events: {
        subscribe: (fn: (value: any) => void) =>
          fn({
            id: "test_id",
            url: "test_url",
          }),
      },
      url: "test_url",
    };

    activeRouteMock = {
      params: {
        subscribe: (fn: (value: any) => void) =>
          fn({
            tab: 0,
          }),
        api: {
          setDatasource: jest.fn(),
        },
      },
    };

    tableHeaderMock = {
      getListofCountries: jest.fn(),
    };

    tableContentMock = {
      getGasData: jest.fn(),
    };

    sharedServiceMock = {
      setCountryCode: jest.fn(),
      getRefreshGrid: jest.fn(),
      getGranularity: jest.fn(),
      setHeader: jest.fn(),
      setErrorMessage: jest.fn(),
      setForecastError: jest.fn(),
      setTableEndDate: jest.fn(),
      csvToJSON: jest.fn(),
      setRowHeader: jest.fn(),
      errorDisplay: jest.fn(),
      updateRowDataOnGranulairty: jest.fn(),
      updateGridData: jest.fn(),
      getToggleToPer: jest.fn(),
      setChartData: jest.fn(),
      getScenario: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AgGridModule],
      declarations: [HistoricTableComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activeRouteMock,
        },
        {
          provide: CountryScenarioStoreService,
          useValue: tableHeaderMock,
        },
        {
          provide: ApiService,
          useValue: tableContentMock,
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

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricTableComponent);
    component = fixture.componentInstance;
    jest
      .spyOn(tableHeaderMock, "getListofCountries")
      .mockReturnValue([of(false), of(true)]);
    jest.spyOn(sharedServiceMock, "getGranularity").mockReturnValue(of(true));
    jest.spyOn(sharedServiceMock, "getRefreshGrid").mockReturnValue(of(true));
    jest
      .spyOn(sharedServiceMock, "updateRowDataOnGranulairty")
      .mockReturnValue(of(true));
    jest.spyOn(sharedServiceMock, "updateGridData").mockReturnValue(of(true));
    jest.spyOn(sharedServiceMock, "getToggleToPer").mockReturnValue(of(true));
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  const gridResponse: any = `DATE,imp_be_h,imp_de_l,imp_be_l,stor_storage_balance,imp_de_h,stor_storage_base,stor_storage_modelled_balance,stor_storage_max_capacity,imp_norway,XXX_storage_capacity,con_ldc,linepack,con_industry,imp_uk,imp_production,imp_lng,stor_storage_modelled,stor_storage_normal_balance,mktBalance,balanceFull,modelledBalanceFull
    2022-11-25,0.0,-58.24,-23.9,58.97,-2.12,,,,0.0,,-83.26,0.0,0.0,30.24,86.74,89.96,0.0,,19.550000000000026,,
    2022-11-24,0.0,-62.43,-60.35,63.54,-3.56,,,,0.0,,-85.92,0.0,0.0,30.24,88.02,224.9,0.0,,-67.35999999999999,,`;

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

  const gridApiParams: any = {
    api: {
      showNoRowsOverlay: jest.fn(),
      showLoadingOverlay: jest.fn(),
      purgeInfiniteCache: jest.fn(),
      setDatasource: jest.fn(),
      setGridOption: jest.fn(),
      ensureIndexVisible: jest.fn(),
      hideOverlay: jest.fn(),
    },
  };

  const bomData = [
    {
      DATE: "BOM",
      linepack: "0.0",
      stor_storage_balance: "67.90909091",
      imp_lng: "90.36363636",
      imp_norway: "22.0",
      imp_uk: "-1.0",
      imp_production: "86.45454545",
      con_industry: "101.45454545",
      imp_be_h: "0.0",
      imp_be_l: "-42.90909091",
      imp_de_l: "-69.0",
      imp_de_h: "-6.0",
      con_ldc: "-133.09090909",
    },
    {
      DATE: "Projected Outturn",
      linepack: "0.0",
      stor_storage_balance: "67.90909091",
      imp_lng: "90.36363636",
      imp_norway: "22.0",
      imp_uk: "-1.0",
      imp_production: "86.45454545",
      con_industry: "101.45454545",
      imp_be_h: "0.0",
      imp_be_l: "-42.90909091",
      imp_de_l: "-69.0",
      imp_de_h: "-6.0",
      con_ldc: "-133.09090909",
    },
  ];

  const updatedResponse = [
    {
      DATE: new Date(),
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

  it("should onHeaderInitalise", () => {
    component.countryCode = "overview";
    jest
      .spyOn(tableHeaderMock, "getListofCountries")
      .mockReturnValue([of(false), of(response)]);
    component.onHeaderInitalise();
  });

  it("should onHeaderInitalise displayname", () => {
    response[0].columns[0].displayname = "testing length should be more";
    component.countryCode = "overview";
    jest
      .spyOn(tableHeaderMock, "getListofCountries")
      .mockReturnValue([of(false), of(response)]);
    component.onHeaderInitalise();
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

  it("should onGridReady", () => {
    jest
      .spyOn(tableContentMock, "getGasData")
      .mockReturnValue(of(gridResponse));
    jest.spyOn(sharedServiceMock, "csvToJSON").mockReturnValue(updatedResponse);
    component.onGridReady(gridApiParams);
  });

  it("should onGridReady Error", () => {
    const errorMessage: any = {
      status: 502,
    };
    jest
      .spyOn(tableContentMock, "getGasData")
      .mockReturnValue(throwError(() => new Error(errorMessage)));
    component.onGridReady(gridApiParams);
  });

  it("should onRowDataChanged", () => {
    component.gridApi = gridApiParams.api;
    component.onRowDataChanged(gridApiParams);
  });

  it("should updatedGridData", () => {
    component.gridApi = gridApiParams.api;
    component.isGridReady = true;
    expect(component.isGridReady).toBe(true);
    jest
      .spyOn(tableContentMock, "getGasData")
      .mockReturnValue(of(gridResponse));
    jest.spyOn(sharedServiceMock, "csvToJSON").mockReturnValue(updatedResponse);
    component.updatedGridData();
  });

  it("should updatedGridData Error", () => {
    component.gridApi = gridApiParams.api;
    component.isGridReady = true;
    const errorMessage: any = {
      status: 502,
    };
    jest
      .spyOn(tableContentMock, "getGasData")
      .mockReturnValue(throwError(() => new Error(errorMessage)));
    component.updatedGridData();
  });

  it("should historyRefreshControl", () => {
    component.historyRefreshControl();
  });

  it("should createBomData", () => {
    component.gridApi = gridApiParams.api;
    const bomResponse =
      "column_name,stor_storage_balance,stor_storage_modelled,con_industry,con_ldc,imp_production,imp_lng,imp_norway,imp_de_h,imp_de_l,imp_be_h,imp_be_l,imp_uk,linepack\nBOM,0,0,0,0,0,0,0,0,0,0,0,0,0\nProjected_Outturn,0,0,0,0,0,0,0,0,0,0,0,0,0\n";
    jest.spyOn(tableContentMock, "getGasData").mockReturnValue(of(bomResponse));
    jest.spyOn(sharedServiceMock, "csvToJSON").mockReturnValue(bomData);
    component.createBomData();
  });

  it("should createBomData error", () => {
    const errorMessage: any = {
      status: 502,
    };
    component.gridApi = gridApiParams.api;
    jest
      .spyOn(tableContentMock, "getGasData")
      .mockReturnValue(throwError(() => new Error(errorMessage)));
    component.createBomData();
  });

  it("should handleScroll", () => {
    let event: BodyScrollEvent = {
      top: 0,
      type: "bodyscroll",
      direction: "horizontal",
      left: 0,
    };
    component.gridApi = gridApiParams.api;
    component.selectedGranularity = "seasonally";
    jest
      .spyOn(tableContentMock, "getGasData")
      .mockReturnValue(of(gridResponse));
    jest
      .spyOn(sharedServiceMock, "csvToJSON")
      .mockReturnValue(of(updatedResponse));
    component.handleScroll(event);
  });

  it("should handleScroll error", () => {
    const errorMessage: any = {
      status: 502,
    };
    let event: BodyScrollEvent = {
      top: 0,
      type: "bodyscroll",
      direction: "horizontal",
      left: 0,
    };
    component.gridApi = gridApiParams.api;
    jest
      .spyOn(tableContentMock, "getGasData")
      .mockReturnValue(throwError(() => new Error(errorMessage)));
    component.handleScroll(event);
  });

  it("should dateFormate", () => {
    component.dateFormate("2022-11-25");
  });

  it("should updateTableOnToggle", () => {
    jest.spyOn(sharedServiceMock, "getToggleToPer").mockReturnValue(of(true));
    component.updateTableOnToggle();
  });

  it("should getStartData", () => {
    component.selectedGranularity = "seasonally";
    component.getStartData();
  });
});
