import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { of } from "rxjs";
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { SharedService } from "../../services/shared-service/shared.service";
import { CountryScenarioStoreService } from "../../services/api-store-service/country-scenario-store.service";
import { ApiService } from "../../services/api-service/api.service";
import { Navbar } from "./navbar.component";

describe("TableNavbar", () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let activeRouteMock: any;
  let dialogMock: any;
  let countryNameMock: any;
  let sharedServiceMock: any;
  let routerMock: any;
  let ApiServiceMock: any;

  beforeEach(async () => {
    dialogMock = {
      open: jest.fn(),
    };
    countryNameMock = {
      getListofCountries: jest.fn(),
      getListOfScenarios: jest.fn(),
    };
    activeRouteMock = {
      params: jest.fn(),
    };

    sharedServiceMock = {
      setGranularity: jest.fn(),
      setRefreshGrid: jest.fn(),
      setDisplayName: jest.fn(),
      getGranularity: jest.fn(),
      setToggleToPer: jest.fn(),
      getToggleToPer: jest.fn(),
      setScenario: jest.fn(),
      setCountryScenarioModes: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [Navbar],
      imports: [MatAutocompleteModule],
      providers: [
        {
          provide: MatDialog,
          useValue: dialogMock,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: {
              subscribe: (fn: (value: Params) => void) =>
                fn({
                  tab: 0,
                }),
            },
          },
        },
        {
          provide: Router,
          useValue: routerMock,
        },
        {
          provide: CountryScenarioStoreService,
          useValue: countryNameMock,
        },
        {
          provide: SharedService,
          useValue: sharedServiceMock,
        },
        {
          provide: ApiService,
          useValue: ApiServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call agInit", () => {
    jest.spyOn(component, "agInit");
    component.agInit("/");
  });

  const scenarioResponse = {
    scenario_modes: {
      'nl': ['default', 'default_nl']
    }
  };

  const response: any[] = [
    {
      name: "overview",
      visualization: "overview",
      forecastable: false,
      columns: [
        {
          id: "mktBalance",
          group: "first",
          percentage_display_name: "",
          bcm_display_name: "",
          shortname: "MktBal",
          appearance: "balancing",
          visualisation: "",
        },
      ],
      displayname: "Overview",
    },
  ];

  const listOfScenarios = {
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

  it("should ngOnInit", () => {
    component.countryCode = "nl";
    jest.spyOn(activeRouteMock, "params").mockReturnValue(of(true));
    jest.spyOn(sharedServiceMock, "getGranularity").mockReturnValue(of(true));
    jest
      .spyOn(countryNameMock, "getListofCountries")
      .mockReturnValue([of(false), of(response)]);
    jest.spyOn(sharedServiceMock, "getToggleToPer").mockReturnValue(of(true));
    jest
      .spyOn(sharedServiceMock, "setCountryScenarioModes")
      .mockReturnValue(of(listOfScenarios));
    component.ngOnInit();
  });

  it("should get countryNames", () => {
    component.countryCode = "overview";
    jest
      .spyOn(countryNameMock, "getListofCountries")
      .mockReturnValue([of(false), of(response)]);
    component.getCountryName();
  });

  it("should uploadFile", () => {
    jest.spyOn(dialogMock, "open").mockReturnValue(true);
    component.uploadFile();

    component.highChart();
  });

  it("should onSelectedOption", () => {
    jest.spyOn(sharedServiceMock, "setGranularity").mockReturnValue(of(true));
    component.onSelectedOption({});
  });

  it("should refreshGrid", () => {
    jest
      .spyOn(countryNameMock, "getListOfScenarios")
      .mockReturnValue([of(true), of(scenarioResponse)]);
    jest
      .spyOn(sharedServiceMock, "setRefreshGrid")
      .mockReturnValue(of(true));
    component.countryCode = 'nl';
    component.refreshGrid();
    expect(component.scenarioNames).toEqual(['default', 'default_nl']);
    expect(sharedServiceMock.setRefreshGrid).toHaveBeenCalledTimes(1);
    expect(sharedServiceMock.setRefreshGrid).toHaveBeenCalledWith(true);
  });

  it("should call listOfScenarios and update scenarioNames", () => {
    jest
      .spyOn(countryNameMock, "getListOfScenarios")
      .mockReturnValue([of(true), of(scenarioResponse)]);
    component.countryCode = 'nl';
    component.listOfScenarios();
    expect(component.scenarioNames).toEqual(['default', 'default_nl']);
  });


  it("should onChangeToggle", () => {
    component.onChangeToggle(true);
  });

  it("should onSelectedScenario", () => {
    jest.spyOn(sharedServiceMock, "setScenario").mockReturnValue(of(true));
  });
});
