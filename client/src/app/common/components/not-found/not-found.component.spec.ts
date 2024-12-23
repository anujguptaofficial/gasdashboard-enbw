import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { RoutingService } from "../../../services/routing-service/routing-service.service";
import { CountryScenarioStoreService } from "../../../services/api-store-service/country-scenario-store.service";

import { NotFoundComponent } from "./not-found.component";

describe("NotFoundComponent", () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let navigateUrlMock: any;
  let listofCountriesMock: any;

  beforeEach(async () => {
    listofCountriesMock = {
      getListofCountries: jest.fn(),
    };

    navigateUrlMock = {
      navigateToURL: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [NotFoundComponent],
      providers: [
        {
          provide: RoutingService,
          useValue: navigateUrlMock,
        },
        {
          provide: CountryScenarioStoreService,
          useValue: listofCountriesMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  const response = [
    {
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
    },
  ];

  it("should ngOnInit", () => {
    jest
      .spyOn(listofCountriesMock, "getListofCountries")
      .mockReturnValue([of(false), of(response)]);
    component.ngOnInit();
  });

  it("should navigateToHomePage", () => {
    component.navigateToHomePage();
  });

  it("should getListOfCountries", () => {
    jest
      .spyOn(listofCountriesMock, "getListofCountries")
      .mockReturnValue([of(false), of(response)]);
    component.getListOfCountries();
  });
});
