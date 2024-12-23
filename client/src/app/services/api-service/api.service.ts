import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { NavbarResponse } from "../../common/interfaces/table.interface";
import { UserDetail } from "../../common/interfaces/header.interface";

interface DataParams {
  startDate: string;
  endDate: string;
  bom: string;
  foreCastMode: string;
  granularity: string;
  countryCode: string;
  percentage: any;
  scenarioValue: string;
}

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) {}

  httpURLs = {
    base_url: environment.base_url,
  };

  httpOptions = {
    headers: new HttpHeaders({}),
    responseType: "text" as "json",
    Accept: "text/csv",
  };

  headers = new HttpHeaders().set("content-type", "application/json");
  uploadHeader = new HttpHeaders().set("content-type", "text/csv");

  getHTTPParams = (paramsObj: { [key: string]: string }): HttpParams => {
    let params = new HttpParams();
    for (const key in paramsObj) {
      if (paramsObj.hasOwnProperty(key)) {
        params = params.set(key, paramsObj[key]);
      }
    }
    return params;
  };

  getUserInfo = (): Observable<UserDetail> => {
    return this.http.get<UserDetail>(`${this.httpURLs.base_url}v1/userInfo`, {
      headers: this.headers,
    });
  };

  getCountryList = (): Observable<NavbarResponse[]> => {
    return this.http
      .get<NavbarResponse[]>(`${this.httpURLs.base_url}v1/spec`, {
        headers: this.headers,
      })
      .pipe(
        map((response) => response),
        catchError((error) => {
          throw error;
        })
      );
  };

  getGasData = (params: DataParams): Observable<any> => {
    const paramsObj = {
      start: params.startDate,
      end: params.endDate,
      bom: params.bom,
      forecast_mode: params.foreCastMode,
      granularity: params.granularity,
      category: params.countryCode,
      percentage: params.percentage,
      scenario: params.scenarioValue,
    };
    const httpParams = this.getHTTPParams(paramsObj);
    return this.http
      .get(`${this.httpURLs.base_url}v1/values`, {
        params: httpParams,
        responseType: "text",
      })
      .pipe(
        map((response) => response),
        catchError((error) => {
          throw error;
        })
      );
  };

  uploadForecast = (
    forecastPeriod: string,
    category: string,
    file: any,
    scenarioValue: string
  ): Observable<any> => {
    const uploadedFile = new FormData();
    uploadedFile.append(
      "file",
      new Blob([file], { type: "text/csv" }),
      file.name
    );
    const paramsObj = {
      forecast_type: `forecast_${forecastPeriod}`,
      category: category,
      scenario: scenarioValue,
    };
    const params = this.getHTTPParams(paramsObj);
    return this.http.post<any>(
      `${this.httpURLs.base_url}v1/forecast`,
      uploadedFile,
      { headers: this.uploadHeader, params }
    );
  };

  getScenarioList = (): Observable<any> => {
    return this.http
      .get<any>(`${this.httpURLs.base_url}v1/scenario`, {
        headers: this.headers,
      })
      .pipe(
        map((response) => response),
        catchError((error) => {
          throw error;
        })
      );
  };

  downloadForecastTemplate = (fileUrl: string) => {
    return this.http.get(fileUrl, { responseType: "blob" });
  };
}
