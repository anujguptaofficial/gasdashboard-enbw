import { HttpHeaders, HttpParams } from "@angular/common/http";
import { of } from "rxjs";

import { environment } from "../../../environments/environment";
import { ApiService } from "./api.service";

describe("HttpClientService", () => {
  let service: ApiService;
  let httpClientSpy: any;
  let httpURLs = {
    base_url: environment.base_url,
  };
  let headers = new HttpHeaders().set("content-type", "application/json");

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
      post: jest.fn(),
    };
    service = new ApiService(httpClientSpy);
  });

  it("should test getCountryList", () => {
    let res = {
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
    jest.spyOn(httpClientSpy, "get").mockReturnValue(of(res));
    service.getCountryList();
    expect(httpClientSpy.get).toBeCalledTimes(1);
    expect(httpClientSpy.get).toHaveBeenCalledWith(
      `${httpURLs.base_url}v1/spec`,
      { headers: headers }
    );
  });

  it("should test getGasData", () => {
    let res: string = `"DATE","stor_storage_balance","imp_be_l","imp_norway","imp_uk","linepack","imp_lng","stor_storage_modelled","imp_production","con_industry","con_ldc","imp_de_h","imp_be_h","imp_de_l","balanceFull","modelledBalanceFull","mktBalance"`;
    jest.spyOn(httpClientSpy, "get").mockReturnValue(of(res));

    const gasDataParams = {
      startDate: "2022-11-09",
      endDate: "2022-11-29",
      bom: "false",
      foreCastMode: "history",
      granularity: "daily",
      countryCode: "nl",
      percentage: "true",
      scenarioValue: "default",
    };

    const expectedParams = new HttpParams()
      .set("start", "2022-11-09")
      .set("end", "2022-11-29")
      .set("bom", "false")
      .set("forecast_mode", "history")
      .set("granularity", "daily")
      .set("category", "nl")
      .set("percentage", "true")
      .set("scenario", "default");

    service.getGasData(gasDataParams);

    expect(httpClientSpy.get).toBeCalledTimes(1);
    expect(httpClientSpy.get).toHaveBeenCalledWith(
      `${httpURLs.base_url}v1/values`,
      { params: expectedParams, responseType: "text" }
    );
  });

  it("should test getGasData for forecastData", () => {
    let res: string = `"DATE","stor_storage_balance","imp_be_l","imp_norway","imp_uk","linepack","imp_lng","stor_storage_modelled","imp_production","con_industry","con_ldc","imp_de_h","imp_be_h","imp_de_l","balanceFull","modelledBalanceFull","mktBalance"`;
    jest.spyOn(httpClientSpy, "get").mockReturnValue(of(res));

    const gasDataParams = {
      startDate: "2022-11-09",
      endDate: "2022-11-29",
      bom: "false",
      foreCastMode: "forecast",
      granularity: "daily",
      countryCode: "nl",
      percentage: "true",
      scenarioValue: "default",
    };

    const expectedParams = new HttpParams()
      .set("start", "2022-11-09")
      .set("end", "2022-11-29")
      .set("bom", "false")
      .set("forecast_mode", "forecast")
      .set("granularity", "daily")
      .set("category", "nl")
      .set("percentage", "true")
      .set("scenario", "default");

    service.getGasData(gasDataParams);

    expect(httpClientSpy.get).toBeCalledTimes(1);
    expect(httpClientSpy.get).toHaveBeenCalledWith(
      `${httpURLs.base_url}v1/values`,
      { params: expectedParams, responseType: "text" }
    );
  });

  it("should test uploadForecast", () => {
    let res: any;
    jest.spyOn(httpClientSpy, "post").mockReturnValue(of(res));
    service.uploadForecast("short_term", "nl", "test", "test_scenario");
    expect(httpClientSpy.post).toBeCalledTimes(1);
  });

  it("should test getUserInfo", () => {
    jest.spyOn(httpClientSpy, "get").mockReturnValue(of(true));
    service.getUserInfo();
    expect(httpClientSpy.get).toBeCalledTimes(1);
    expect(httpClientSpy.get).toHaveBeenCalledWith(
      `${httpURLs.base_url}v1/userInfo`,
      { headers: headers }
    );
  });

  it("should test displayBOM", () => {
    const bomResponse: string =
      "column_name,stor_storage_balance,stor_storage_modelled,con_industry,con_ldc,imp_production,imp_lng,imp_norway,imp_de_h,imp_de_l,imp_be_h,imp_be_l,imp_uk,linepack\nBOM,0,0,0,0,0,0,0,0,0,0,0,0,0\nProjected_Outturn,0,0,0,0,0,0,0,0,0,0,0,0,0";
    jest.spyOn(httpClientSpy, "get").mockReturnValue(of(bomResponse));

    const gasDataParams = {
      startDate: "2022-11-09",
      endDate: "2022-11-29",
      bom: "true",
      foreCastMode: "forecast",
      granularity: "daily",
      countryCode: "nl",
      percentage: true,
      scenarioValue: "test_scenario",
    };

    service.getGasData(gasDataParams);
  });

  it("should test getScenarioList", () => {
    jest.spyOn(httpClientSpy, "get").mockReturnValue(of(true));
    service.getScenarioList();
  });
});
