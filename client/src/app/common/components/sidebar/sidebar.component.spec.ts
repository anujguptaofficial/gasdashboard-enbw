import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";

import { SidebarComponent } from "./sidebar.component";
import { CountryScenarioStoreService } from "../../../services/api-store-service/country-scenario-store.service";
import { RoutingService } from "../../../services/routing-service/routing-service.service";

describe("SidebarComponent", () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let routingServiceMock: any;
  let listofCountriesMock: any;

  beforeEach(async () => {
    listofCountriesMock = {
      getListofCountries: jest.fn(),
    };
    routingServiceMock = {
      navigateToURL: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      providers: [
        {
          provide: CountryScenarioStoreService,
          useValue: listofCountriesMock,
        },
        {
          provide: RoutingService,
          useValue: routingServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
  });

  it("should call getListOfCountries", () => {
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
      .spyOn(listofCountriesMock, "getListofCountries")
      .mockReturnValue([of(false), of(response)]);
    component.ngOnInit();
  });

  it("should call getListOfCountries changing uk code", () => {
    const response = {
      name: "uk",
      visualization: "uk",
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
    component.listOfCountries = [
      {
        code: "nwe_overview",
        country: "nwe_overview",
        countryCode: "gb",
      },
    ];
    jest
      .spyOn(listofCountriesMock, "getListofCountries")
      .mockReturnValue([of(false), of(response)]);
    component.getListOfCountries();
  });

  it("should navigateToURL", () => {
    const button: any = fixture.nativeElement.querySelectorAll(
      "button.ng-star-inserted"
    )[0];
    if (button) {
      const clickSpy = jest.spyOn(button, "click");
      button.click();
      expect(clickSpy).toHaveBeenCalledTimes(1);
    }
    component.navigateToCountryURL("nl");
  });
});
