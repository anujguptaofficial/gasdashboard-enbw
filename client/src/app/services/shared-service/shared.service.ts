import { Injectable } from "@angular/core";
import { ColDef, GridApi } from "@ag-grid-community/core";
import { BehaviorSubject } from "rxjs";
import * as moment from "moment";

import {
  CONSTANTS,
  ERROR,
  GRANULARITY_OPTIONS,
} from "../../common/utils/constant";
import { HeaderColumn } from "../../common/interfaces/table.interface";

@Injectable({
  providedIn: "root",
})
export class SharedService {
  granularity = new BehaviorSubject(GRANULARITY_OPTIONS[0]);
  countryCode = new BehaviorSubject("");
  allCountryCode = new BehaviorSubject([""]);
  errorMessage = new BehaviorSubject("");
  gridRefreshData = new BehaviorSubject(false);
  forecastRowData = new BehaviorSubject("");
  tableHeaderRow = new BehaviorSubject([]);
  forecastHeader = new BehaviorSubject("");
  displayName = new BehaviorSubject("");
  tableHeader = new BehaviorSubject("");
  forecasetErrorMessage = new BehaviorSubject("");
  dropDownChange = new BehaviorSubject("");
  toggleEvent = new BehaviorSubject(true);
  chartData = new BehaviorSubject("");
  scenarioData = new BehaviorSubject("default");
  countryScenarioModes = new BehaviorSubject<string[]>([]);

  setErrorMessage = (err: string) => {
    if (err) {
      this.errorMessage.next(err);
    }
  };

  getErrorMessage = () => {
    return this.errorMessage.asObservable();
  };

  setGranularity = (granu: any) => {
    if (granu) {
      this.granularity.next(granu);
    }
  };

  getGranularity = () => {
    return this.granularity.asObservable();
  };

  setCountryCode = (code: string) => {
    if (code) {
      this.countryCode.next(code);
    }
  };

  getCountryCode = () => {
    return this.countryCode.asObservable();
  };

  setDisplayName = (name: string) => {
    if (name) {
      this.displayName.next(name);
    }
  };

  getDisplayName = () => {
    return this.displayName.asObservable();
  };

  setRefreshGrid = (data: boolean) => {
      this.gridRefreshData.next(data);
  };

  getRefreshGrid = () => {
    return this.gridRefreshData.asObservable();
  };

  setScenario = (data: string) => {
    if (data) {
      this.scenarioData.next(data);
    }
  };

  getScenario = () => {
    return this.scenarioData.asObservable();
  };

  setForecastRowData = (data: any) => {
    if (data) {
      this.forecastRowData.next(data);
    }
  };

  getForecastRowData = () => {
    return this.forecastRowData.asObservable();
  };

  setRowHeader = (header: any) => {
    if (header) {
      this.tableHeaderRow.next(header);
    }
  };

  getRowHeader = () => {
    return this.tableHeaderRow.asObservable();
  };

  setHeader = (data: any) => {
    if (data) {
      this.tableHeader.next(data);
    }
  };

  getHeader = () => {
    return this.tableHeader.asObservable();
  };

  setDropDownChange = (data: any) => {
    this.dropDownChange.next(data);
  };

  getDropDownChange = () => {
    return this.dropDownChange.asObservable();
  };

  setToggleToPer = (event: boolean) => {
    this.toggleEvent.next(event);
  };

  getToggleToPer = () => {
    return this.toggleEvent.asObservable();
  };

  setChartData = (data: any) => {
    this.chartData.next(data);
  };

  getChartData = () => {
    return this.chartData.asObservable();
  };

  setCountryScenarioModes = (modes: any) => {
    this.countryScenarioModes.next(modes);
  };

  getCountryScenarioModes = () => {
    return this.countryScenarioModes.asObservable();
  };

  setAllCountryCodes = (list: string[]) => {
    this.allCountryCode.next(list);
  };

  getAllCountryCodes = () => {
    return this.allCountryCode.asObservable();
  };

  csvToJSON = (res: any): ColDef[] => {
    const rows: ColDef[] = [];
    const csvToArray = res.split("\n");
    let headers: any = csvToArray[0].split(",");
    for (let index = 1; index < csvToArray.length; index++) {
      const row: any = {};
      const entry: any = csvToArray[index].split(",");
      for (let i = 0; i < headers.length; i++) {
        if (
          headers[i] === CONSTANTS.UPPERCASE_DATE ||
          headers[i] === CONSTANTS.COLUMN_NAME
        ) {
          row[CONSTANTS.UPPERCASE_DATE] = entry[i];
        } else {
          row[headers[i]] = entry[i] ? Math.round(entry[i]) : entry[i];
        }
      }
      rows.push(row);
    }
    return rows;
  };

  errorDisplay = (error: any, gridApi: GridApi) => {
    gridApi.showNoRowsOverlay();
    if (error.status == 502) {
      this.setErrorMessage(ERROR.ERROR_502);
    } else if (error.status == 408) {
      this.setErrorMessage(ERROR.ERROR_408);
    } else if (error.status == 401) {
      this.setErrorMessage(ERROR.ERROR_401);
    } else {
      const errorMessage: string = error.error ? error.error : error.message;
      this.setErrorMessage(errorMessage);
    }
  };

  getMonth = (params: any) => {
    return params.value
      ? moment(params.value, CONSTANTS.FORMAT_DATE).toDate().getMonth()
      : "";
  };

  getMonthForRows = (params: any) => {
    return params.data
      ? moment(params.data.DATE, CONSTANTS.FORMAT_DATE).toDate().getMonth()
      : "";
  };

  updateRowDataOnGranulairty = (
    granularity: string | null,
    startRow: number,
    endRow: number,
    isForecastTable: boolean
  ) => {
    switch (granularity) {
      case GRANULARITY_OPTIONS[1]:
        return isForecastTable
          ? [
              moment().add(startRow, "weeks").format(CONSTANTS.FORMAT_DATE),
              moment().add(endRow, "weeks").format(CONSTANTS.FORMAT_DATE),
            ]
          : [
              moment()
                .subtract(startRow, "weeks")
                .format(CONSTANTS.FORMAT_DATE),
              moment().subtract(endRow, "weeks").format(CONSTANTS.FORMAT_DATE),
            ];
      case GRANULARITY_OPTIONS[2]:
        return isForecastTable
          ? [
              moment().add(startRow, "months").format(CONSTANTS.FORMAT_DATE),
              moment().add(endRow, "months").format(CONSTANTS.FORMAT_DATE),
            ]
          : [
              moment()
                .subtract(startRow, "months")
                .format(CONSTANTS.FORMAT_DATE),
              moment().subtract(endRow, "months").format(CONSTANTS.FORMAT_DATE),
            ];
      case GRANULARITY_OPTIONS[3]:
        return isForecastTable
          ? [
              moment().add(startRow, "quarters").format(CONSTANTS.FORMAT_DATE),
              moment().add(endRow, "quarters").format(CONSTANTS.FORMAT_DATE),
            ]
          : [
              moment()
                .subtract(startRow, "quarters")
                .format(CONSTANTS.FORMAT_DATE),
              moment()
                .subtract(endRow, "quarters")
                .format(CONSTANTS.FORMAT_DATE),
            ];
      case GRANULARITY_OPTIONS[4]:
        return this.yearlyGranularity(isForecastTable, startRow, endRow);
      case GRANULARITY_OPTIONS[5]:
        return this.yearlyGranularity(isForecastTable, startRow, endRow);
      default:
        return isForecastTable
          ? [
              moment().add(startRow, "days").format(CONSTANTS.FORMAT_DATE),
              moment().add(endRow, "days").format(CONSTANTS.FORMAT_DATE),
            ]
          : [
              moment().subtract(startRow, "days").format(CONSTANTS.FORMAT_DATE),
              moment().subtract(endRow, "days").format(CONSTANTS.FORMAT_DATE),
            ];
    }
  };

  yearlyGranularity = (
    isForecastTable: boolean,
    startRow: number,
    endRow: number
  ) => {
    return isForecastTable
      ? [
          moment().add(startRow, "years").format(CONSTANTS.FORMAT_DATE),
          moment().add(endRow, "years").format(CONSTANTS.FORMAT_DATE),
        ]
      : [
          moment().subtract(startRow, "years").format(CONSTANTS.FORMAT_DATE),
          moment().subtract(endRow, "years").format(CONSTANTS.FORMAT_DATE),
        ];
  };

  percentageToggle = (toggle: boolean, header: HeaderColumn) => {
    const perSwitch = header.percentage_display_name;
    const bcmSwitch = header.bcm_display_name;
    return toggle
      ? perSwitch.split("").length <= 16
        ? perSwitch
        : `${perSwitch.substring(0, 16)}...`
      : bcmSwitch.split("").length <= 16
      ? bcmSwitch
      : `${bcmSwitch.substring(0, 16)}...`;
  };
}
