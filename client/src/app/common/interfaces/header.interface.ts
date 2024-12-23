export interface UserDetail {
  email: string;
  userName: string;
  avatar: string;
}

export interface ScenarioDetail {
    forecast_modes: [],
    scenario_modes: { [key: string]: string[] };
}

export interface ExportTemplateSheetname {
  sheetName: string;
  headers: string[];
}
