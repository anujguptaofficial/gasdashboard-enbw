import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { Chart } from "chart.js/auto";
import { MatDialogRef } from "@angular/material/dialog";

import { HighchartTablesComponent } from "./highchart-tables.component";
import { SharedService } from "../../../services/shared-service/shared.service";

describe("HighchartTablesComponent", () => {
  let component: HighchartTablesComponent;
  let fixture: ComponentFixture<HighchartTablesComponent>;
  let sharedServiceMock: any;
  let MatDialogRefMock: any;

  beforeEach(async () => {
    sharedServiceMock = {
      getChartData: jest.fn(),
      getRowHeader: jest.fn(),
      getDisplayName: jest.fn(),
      getForecastRowData: jest.fn(),
      getToggleToPer: jest.fn(),
    };

    MatDialogRefMock = {
      close: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [HighchartTablesComponent],
      providers: [
        {
          provide: SharedService,
          useValue: sharedServiceMock,
        },
        { provide: MatDialogRef, useValue: MatDialogRefMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HighchartTablesComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  const getChartData = [
    {
      DATE: "2022-12-03",
      imp_be_h: "",
      imp_de_l: "-222.6",
      linepack: "",
      agsi_storage_level: "121.19",
      imp_production: "304.08",
      con_ldc: "-480.41",
      _day_balance: "",
      modelled_storage_total: "",
      agsi_available_volume: "138.94",
      imp_lng: "315.84",
      modelled_storage: "",
      stor_storage_balance: "194.53",
      con_industry: "328.79",
      imp_de_h: "-14.84",
      imp_norway: "",
      imp_be_l: "-135.52",
      imp_uk: "-0.07",
      mktBalance: "99.26000000000008",
    },
    {
      DATE: "2022-12-04",
      imp_be_h: "",
      imp_de_l: "-222.6",
      linepack: "",
      agsi_storage_level: "121.19",
      imp_production: "304.08",
      con_ldc: "-480.41",
      _day_balance: "",
      modelled_storage_total: "",
      agsi_available_volume: "138.94",
      imp_lng: "315.84",
      modelled_storage: "",
      stor_storage_balance: "194.53",
      con_industry: "328.79",
      imp_de_h: "-14.84",
      imp_norway: "",
      imp_be_l: "-135.52",
      imp_uk: "-0.07",
      mktBalance: "99.26000000000008",
    },
  ];

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

  const getRowHeaderElse = [
    {
      id: "con_industry",
      group: "p_balance",
      displayname: "Balance % full",
      shortname: "% Full",
      appearance: "primary_color",
      visualisation: "",
    },
    {
      id: "balanceFull",
      group: "consumption",
      displayname: "Industry",
      shortname: "In",
      appearance: "primary_color",
      visualisation: "",
    },
  ];

  const getRowHeaderIfElse = [
    {
      id: "balanceFull",
      group: "p_balance",
      displayname: "Balance % full",
      shortname: "% Full",
      appearance: "primary_color",
      visualisation: "",
    },
    {
      id: "balanceFull",
      group: "consumption",
      displayname: "Industry",
      shortname: "In",
      appearance: "primary_color",
      visualisation: "",
    },
  ];

  const rowData = [
    {
      DATE: "2022-11-18",
      balanceFull: "",
      con_industry: "",
      con_ldc: "",
      imp_be_h: "",
      imp_be_l: "",
      imp_de_h: "",
      imp_de_l: "",
      imp_lng: "",
      imp_norway: "",
      imp_production: "",
      imp_uk: "",
      linepack: "",
      mktBalance: "",
      modelledBalanceFull: "",
      stor_storage_balance: "",
    },
  ];

  const rowHeaderData: any = [
    "Market Balance",
    "Storage Balance",
    "Storage Modelled",
    "Industry",
    "LDZ",
    "Production",
    "LNG",
    "Norway",
    "DE-H",
    "DE-L",
    "BE-H",
    "BE-L",
    "UK",
    "Linepack",
    "Balance % full",
    "Modelled % full",
  ];

  it("should ngOnInit", () => {
    jest
      .spyOn(sharedServiceMock, "getRowHeader")
      .mockReturnValue(of(getRowHeader));
    jest
      .spyOn(sharedServiceMock, "getChartData")
      .mockReturnValue(of(getChartData));
    jest.spyOn(sharedServiceMock, "getDisplayName").mockReturnValue(of(true));
    jest
      .spyOn(sharedServiceMock, "getForecastRowData")
      .mockReturnValue(of(getChartData));
    jest.spyOn(sharedServiceMock, "getToggleToPer").mockReturnValue(of(true));
    let chart = new Chart("MyChart", {
      type: "line",
      data: {
        labels: [new Date()],
        datasets: [],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
    expect(chart).toBeTruthy();
    let forecastChart = new Chart("MyForecastChart", {
      type: "line",
      data: {
        labels: [new Date()],
        datasets: [],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
    expect(forecastChart).toBeTruthy();
    component.ngOnInit();
  });

  it("should structuredData", () => {
    component.structuredData(
      { data: { datasets: [] } },
      rowData,
      rowHeaderData
    );
  });

  it("should chartDataSet", () => {
    component.chartDataSet([]);

    component.chartDataSet(["test", "test2"]);
  });

  it("should getallDate", () => {
    let tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);
    component.getallDate(new Date(), tomorrow);
  });

  it("should closeDialog", () => {
    component.closeDialog();
  });

  it("should ngAfterViewInit", () => {
    component.chart = { data: { datasets: [] } };
    component.rowDataRes = rowData;
    component.rowDataHeader = rowHeaderData;
    component.ngAfterViewInit();
  });

  it("should getDatafromService else condition", () => {
    jest
      .spyOn(sharedServiceMock, "getRowHeader")
      .mockReturnValue(of(getRowHeaderElse));
    jest
      .spyOn(sharedServiceMock, "getChartData")
      .mockReturnValue(of(getChartData));
    jest.spyOn(sharedServiceMock, "getDisplayName").mockReturnValue(of(true));
    jest
      .spyOn(sharedServiceMock, "getForecastRowData")
      .mockReturnValue(of(getChartData));
    jest.spyOn(sharedServiceMock, "getToggleToPer").mockReturnValue(of(false));
    component.getDatafromService();

    jest
      .spyOn(sharedServiceMock, "getRowHeader")
      .mockReturnValue(of(getRowHeaderIfElse));
    component.getDatafromService();
  });
});
