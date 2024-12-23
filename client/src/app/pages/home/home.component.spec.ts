import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import * as XLSX from "xlsx";

import { HomeComponent } from "./home.component";
import { CountryScenarioStoreService } from "../../services/api-store-service/country-scenario-store.service";
import { ApiService } from "../../services/api-service/api.service";
import { SharedService } from "../../services/shared-service/shared.service";

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let apiServiceMock: any;
  let sharedServiceMock: any;
  let excelFormatMock: any;
  let dialogMock: any;
  let routerMock: any;

  beforeEach(async () => {
    sharedServiceMock = {
      setCountryScenarioModes: jest.fn()
    };
    dialogMock = {
      open: jest.fn(),
    };
    routerMock = {
      navigate: jest.fn(),
    };
    excelFormatMock = {
      getListofCountries: jest.fn(),
      getListOfScenarios: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: SharedService, useValue: sharedServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: Router, useValue: routerMock },
        { provide: CountryScenarioStoreService, useValue: excelFormatMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  const scenarioResponse = {
    scenario_modes:
    {
      "nwe_overview": ["default", "default_nl"]
    }
  };

  it("should call generateExcelHeaders without subscribing", () => {
    const excelHeadersMock = [
      {
        name: "Country A",
        columns: [{ manual_upload: true, id: "col1" }],
      },
      {
        name: "Country B",
        columns: [{ manual_upload: true, id: "col2" }],
      },
      {
        name: "nwe_overview",
        columns: [{ manual_upload: true, id: "col3" }],
      },
    ];
    jest
      .spyOn(excelFormatMock, "getListofCountries")
      .mockReturnValue([of([]), of(excelHeadersMock)]);
    component.generateExcelHeaders();
    expect(excelFormatMock.getListofCountries).toHaveBeenCalled();
  });

  it("should maintain the same composition of headers", () => {
    const expectedHeaders = [
      { sheetName: "Country A", headers: ["col1"] },
      { sheetName: "Country B", headers: ["col2"] },
    ];
    const excelHeadersMock = [
      {
        name: "Country A",
        columns: [{ manual_upload: true, id: "col1" }],
      },
      {
        name: "Country B",
        columns: [{ manual_upload: true, id: "col2" }],
      },
    ];
    jest
      .spyOn(excelFormatMock, "getListofCountries")
      .mockReturnValue([of([]), of(excelHeadersMock)]);
    const headers = component.generateExcelHeaders();
    expect(headers).toEqual(expectedHeaders);
  });

  it("should export Excel file", () => {
    jest.spyOn(XLSX, "writeFile").mockImplementation(() => { });
    jest.spyOn(component, "generateExcelHeaders").mockReturnValue([
      {
        sheetName: "Country A",
        headers: ["col1"],
      },
      {
        sheetName: "Country B",
        headers: ["col2"],
      },
    ]);
    component.exportExcel();
    expect(XLSX.writeFile).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything()
    );
  });

  it('should getListOfScenarios on init', fakeAsync(() => {
    jest
      .spyOn(excelFormatMock, 'getListOfScenarios')
      .mockReturnValue([null, of(scenarioResponse)]);

    const setCountryScenarioModes = jest.spyOn(sharedServiceMock, 'setCountryScenarioModes');
    component.listOfScenarios();
    tick(1500);
    expect(excelFormatMock.getListOfScenarios).toHaveBeenCalled();
    expect(setCountryScenarioModes).toHaveBeenCalledWith(['default', 'default_nl']);
  })
  );
});
