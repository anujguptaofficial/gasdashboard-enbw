import { GridApi, ScrollDirection } from "@ag-grid-community/core";

export interface NavbarResponse {
  name: string;
  visualization: string;
  columns: HeaderColumn[];
  displayname: string;
  percentage_display_name: string;
  bcm_display_name: string;
  forecastable: boolean;
}

export interface HeaderColumn {
  id: string;
  group: string;
  displayname: string;
  percentage_display_name: string;
  bcm_display_name: string;
  shortname: string;
  appearance: string;
  visualisation: string;
}

export interface HeaderField {
  field: string | undefined;
  colId: string | undefined;
}

export interface BodyScrollEvent {
  type: string;
  api?: GridApi;
  direction: ScrollDirection;
  left: number;
  top: number;
}


export interface ForecastGasDataParams {
  startDate: string;
  endDate: string;
  bom: string;
  foreCastMode: string;
  granularity: string;
  countryCode: string;
  percentage: any;
  scenarioValue: string;
}

export interface DownloadExcelColumns {
  bcm_display_name: string,
  id: string
}