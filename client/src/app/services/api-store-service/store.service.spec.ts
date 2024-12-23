import { of } from "rxjs";

import { StoreService } from "./store.service";

describe("StoreService", () => {
  let service: StoreService;
  let countryListMock: any;
  let scenarioListMock: any;
  let storeMock: any;

  beforeEach(() => {
    countryListMock = {
      getCountryList: jest.fn(),
    };

    scenarioListMock = {
      getListOfScenarios: jest.fn(),
    }

    storeMock = {
      provideMockStore: jest.fn(),
      select: jest.fn(),
      dispatch: jest.fn(),
    };
    service = new StoreService(countryListMock, storeMock);
  });

  it("should getListofCountries force true", () => {
    jest
      .spyOn(countryListMock, "getCountryList")
      .mockReturnValue(of([false, true]));
    jest.spyOn(storeMock, "select").mockReturnValue(of(false));
    service.getListofCountries(false);
  });

  it("should getListofCountries force false", () => {
    jest
      .spyOn(countryListMock, "getCountryList")
      .mockReturnValue(of([true, false]));
    jest.spyOn(storeMock, "select").mockReturnValue(of(true));
    service.getListofCountries();
  });

  it("should getListOfScenarios force true", () => {
    jest
      .spyOn(scenarioListMock, "getListOfScenarios")
      .mockReturnValue(of([false, true]));
    jest.spyOn(storeMock, "select").mockReturnValue(of(false));
    service.getListOfScenarios(false);
  });

  it("should getListOfScenarios force false", () => {
    jest
      .spyOn(scenarioListMock, "getListOfScenarios")
      .mockReturnValue(of([true, false]));
    jest.spyOn(storeMock, "select").mockReturnValue(of(true));
    service.getListOfScenarios();
  });
});
