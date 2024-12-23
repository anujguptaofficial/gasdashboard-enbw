import { TestBed } from "@angular/core/testing";

import { SharedService } from "./shared.service";
import { HeaderColumn } from "../../common/interfaces/table.interface";

describe("SharedService", () => {
  let service: SharedService;
  const gridApiParams: any = {
    api: {
      setDatasource: jest.fn(),
      showLoadingOverlay: jest.fn(),
      hideOverlay: jest.fn(),
      showNoRowsOverlay: jest.fn(),
      purgeInfiniteCache: jest.fn(),
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  const gridResponse: any = `DATE,linepack,imp_production,stor_storage_modelled,con_industry,imp_uk,imp_de_h,imp_be_l,stor_storage_balance,imp_de_l,con_ldc,imp_be_h,imp_norway,imp_lng,mktBalance,balanceFull,modelledBalanceFull
    2023-02-06,,,,,,,,,,,,,,,,
    2023-01-30,,,,,,,,,,,,,,,,
    2023-01-23,2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0,-18.0,,`;

  const notificationMessage: any = {
    message: "test",
    type: {
      success: 0,
      warning: 1,
      error: 2,
      info: 3,
    },
  };

  it("should updatedGranularity", () => {
    service.setErrorMessage("test_error");

    service.getErrorMessage();

    service.setGranularity("test");

    service.getGranularity();

    service.setCountryCode("test_country");

    service.getCountryCode();

    service.setHeader("test_headers");

    service.getHeader();

    service.setRefreshGrid(true);

    service.getRefreshGrid();

    service.setDisplayName("test");

    service.getDisplayName();

    service.setRefreshGrid(true);

    service.getRefreshGrid();

    service.setChartData("test");

    service.getChartData();

    service.setForecastRowData("test");

    service.getForecastRowData();

    service.setRowHeader({});

    service.getRowHeader();

    service.setHeader("12-5-2022");

    service.getHeader();

    service.csvToJSON(gridResponse);

    service.csvToJSON("");

    service.setDropDownChange("");

    service.getDropDownChange();

    service.setToggleToPer(true);

    service.getToggleToPer();

    service.setScenario("test");

    service.getScenario();

    service.setCountryScenarioModes("test");

    service.getCountryScenarioModes();
  });

  it("should errorDisplay", () => {
    let error = {
      status: 502,
    };
    service.errorDisplay(error, gridApiParams.api);

    service.errorDisplay({ status: 408 }, gridApiParams.api);

    service.errorDisplay({ status: 401 }, gridApiParams.api);

    service.errorDisplay({ status: 400 }, gridApiParams.api);
  });

  it("should getMonth", () => {
    const params = {
      value: "test",
    };
    service.getMonth(params);

    service.getMonth({});
  });

  it("should getMonthForRows", () => {
    const response = {
      data: "test",
    };
    service.getMonthForRows(response);

    service.getMonthForRows({});
  });

  it("should updateRowDataOnGranulairty", () => {
    service.updateRowDataOnGranulairty("daily", 0, 60, true);

    service.updateRowDataOnGranulairty("weekly", 0, 60, true);

    service.updateRowDataOnGranulairty("monthly", 0, 60, true);

    service.updateRowDataOnGranulairty("quarterly", 0, 60, true);

    service.updateRowDataOnGranulairty("yearly", 0, 60, true);

    service.updateRowDataOnGranulairty("seasonally", 0, 60, true);

    service.updateRowDataOnGranulairty("test", 0, 60, true);

    service.updateRowDataOnGranulairty("daily", 0, 60, false);

    service.updateRowDataOnGranulairty("weekly", 0, 60, false);

    service.updateRowDataOnGranulairty("monthly", 0, 60, false);

    service.updateRowDataOnGranulairty("quarterly", 0, 60, false);

    service.updateRowDataOnGranulairty("yearly", 0, 60, false);

    service.updateRowDataOnGranulairty("seasonally", 0, 60, false);

    service.updateRowDataOnGranulairty("test", 0, 60, false);
  });

  const headerColumn: HeaderColumn = {
    id: "test_id",
    group: "test_group",
    displayname: "test_name",
    percentage_display_name: "test_name",
    bcm_display_name: "test_name",
    shortname: "test_name",
    appearance: "test_name",
    visualisation: "test_name",
  };
  const headerColumnElse: HeaderColumn = {
    id: "test_id",
    group: "test_group",
    displayname: "test_name",
    percentage_display_name: "test_name_should_greater",
    bcm_display_name: "test_name_should_greater",
    shortname: "test_name",
    appearance: "test_name",
    visualisation: "test_name",
  };

  it("should percentageToggle toggle on state", () => {
    service.percentageToggle(true, headerColumn);

    service.percentageToggle(true, headerColumnElse);
  });

  it("should percentageToggle toggle off state", () => {
    service.percentageToggle(false, headerColumn);

    service.percentageToggle(false, headerColumnElse);
  });
});
